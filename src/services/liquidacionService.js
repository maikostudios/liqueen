// Servicio para manejar la lógica de liquidaciones

export class LiquidacionService {
  // Formatear moneda chilena
  static formatMoney(amount) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  }

  // Formatear número sin símbolo de moneda
  static formatNumber(amount) {
    return new Intl.NumberFormat("es-CL").format(amount || 0);
  }

  // Formatear fecha
  static formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL");
  }

  // Calcular sueldo proporcional basado en días trabajados
  static calculateProportionalSalary(sueldoBase, diasTrabajados, diasMes = 30) {
    if (!sueldoBase || !diasTrabajados) return 0;
    return Math.round((sueldoBase * diasTrabajados) / diasMes);
  }

  // Calcular descuentos automáticamente basados en sueldo imponible
  static calculateAutomaticDeductions(sueldoImponible) {
    const afp = Math.round(sueldoImponible * 0.1145); // 11.45% AFP Provida
    const salud = Math.round(sueldoImponible * 0.07); // 7% Fonasa
    const seguroDesempleo = Math.round(sueldoImponible * 0.006); // 0.6% Seguro Desempleo

    return { afp, salud, seguroDesempleo };
  }

  // Actualizar automáticamente haberes y descuentos basados en sueldo base y días
  static updateAutomaticCalculations(formData) {
    const sueldoBase = formData.trabajador?.sueldoBase || 0;
    const diasTrabajados = formData.trabajador?.diasTrabajados || 30;

    // Calcular sueldo proporcional
    const sueldoProporcional = this.calculateProportionalSalary(
      sueldoBase,
      diasTrabajados
    );

    // SIEMPRE actualizar sueldo base en haberes imponibles
    const sueldoBaseIndex = formData.haberesImponibles.findIndex(
      (item) =>
        item.concepto.toLowerCase().includes("sueldo") ||
        item.concepto.toLowerCase().includes("base")
    );

    if (sueldoBaseIndex !== -1) {
      // FORZAR actualización del sueldo proporcional
      formData.haberesImponibles[sueldoBaseIndex].monto = sueldoProporcional;
    }

    // Calcular total imponible DESPUÉS de actualizar sueldo base
    const totalImponible = formData.haberesImponibles.reduce(
      (sum, item) => sum + (item.monto || 0),
      0
    );

    // Calcular descuentos automáticos basados en el total imponible actualizado
    const descuentosAuto = this.calculateAutomaticDeductions(totalImponible);

    // SIEMPRE actualizar descuentos legales automáticamente
    const afpIndex = formData.descuentosLegales.findIndex(
      (item) =>
        item.concepto.toLowerCase().includes("afp") ||
        item.concepto.toLowerCase().includes("provida")
    );
    if (afpIndex !== -1) {
      formData.descuentosLegales[afpIndex].monto = descuentosAuto.afp;
    }

    const saludIndex = formData.descuentosLegales.findIndex(
      (item) =>
        item.concepto.toLowerCase().includes("salud") ||
        item.concepto.toLowerCase().includes("fonasa")
    );
    if (saludIndex !== -1) {
      formData.descuentosLegales[saludIndex].monto = descuentosAuto.salud;
    }

    const seguroDesempleoIndex = formData.descuentosLegales.findIndex(
      (item) =>
        item.concepto.toLowerCase().includes("desempleo") ||
        item.concepto.toLowerCase().includes("cesant") ||
        item.concepto.toLowerCase().includes("seguro")
    );
    if (seguroDesempleoIndex !== -1) {
      formData.descuentosLegales[seguroDesempleoIndex].monto =
        descuentosAuto.seguroDesempleo;
    }

    return formData;
  }

  // Calcular totales automáticamente
  static calculateTotals(formData) {
    // Primero actualizar cálculos automáticos
    const updatedFormData = this.updateAutomaticCalculations({ ...formData });

    const totalHaberesImponibles = updatedFormData.haberesImponibles.reduce(
      (sum, item) => sum + (item.monto || 0),
      0
    );

    const totalHaberesNoImponibles = updatedFormData.haberesNoImponibles.reduce(
      (sum, item) => sum + (item.monto || 0),
      0
    );

    const totalDescuentosLegales = updatedFormData.descuentosLegales.reduce(
      (sum, item) => sum + (item.monto || 0),
      0
    );

    const totalOtrosDescuentos = updatedFormData.otrosDescuentos.reduce(
      (sum, item) => sum + (item.monto || 0),
      0
    );

    const totalHaberes = totalHaberesImponibles + totalHaberesNoImponibles;
    const totalDescuentos = totalDescuentosLegales + totalOtrosDescuentos;

    // Buscar conceptos específicos en descuentos legales con mejor detección
    const afp =
      updatedFormData.descuentosLegales.find(
        (d) =>
          d.concepto.toLowerCase().includes("afp") ||
          d.concepto.toLowerCase().includes("provida")
      )?.monto || 0;

    const salud =
      updatedFormData.descuentosLegales.find(
        (d) =>
          d.concepto.toLowerCase().includes("salud") ||
          d.concepto.toLowerCase().includes("fonasa")
      )?.monto || 0;

    const seguroDesempleo =
      updatedFormData.descuentosLegales.find(
        (d) =>
          d.concepto.toLowerCase().includes("desempleo") ||
          d.concepto.toLowerCase().includes("cesant") ||
          d.concepto.toLowerCase().includes("seguro")
      )?.monto || 0;

    const impPrevSalud = afp + salud;
    const impSeguroDesempleo = seguroDesempleo;
    const baseTributable = totalHaberesImponibles;
    const liquido = totalHaberes - totalDescuentos;

    return {
      totalHaberes,
      totalDescuentos,
      impPrevSalud,
      impSeguroDesempleo,
      baseTributable,
      liquido,
      updatedFormData, // Devolver también los datos actualizados
    };
  }

  // Validar datos del formulario
  static validateFormData(formData) {
    const errors = [];

    if (!formData.empleador?.trim()) {
      errors.push("El nombre del empleador es requerido");
    }

    if (!formData.trabajador?.nombre?.trim()) {
      errors.push("El nombre del trabajador es requerido");
    }

    if (!formData.trabajador?.rut?.trim()) {
      errors.push("El RUT del trabajador es requerido");
    }

    return errors;
  }

  // Convertir datos del formulario a formato JSON
  static formToJson(formData) {
    return {
      empleador: formData.empleador,
      rutEmpleador: formData.rutEmpleador,
      area: formData.area,
      mes: formData.mes,
      trabajador: {
        ...formData.trabajador,
        inicioContrato: this.formatDate(formData.trabajador.inicioContrato),
      },
      haberesImponibles: formData.haberesImponibles.filter((item) =>
        item.concepto?.trim()
      ),
      haberesNoImponibles: formData.haberesNoImponibles.filter((item) =>
        item.concepto?.trim()
      ),
      descuentosLegales: formData.descuentosLegales.filter((item) =>
        item.concepto?.trim()
      ),
      otrosDescuentos: formData.otrosDescuentos.filter((item) =>
        item.concepto?.trim()
      ),
      totales: this.calculateTotals(formData),
    };
  }

  // Convertir fecha DD/MM/YYYY a YYYY-MM-DD para input date
  static convertDateFormat(dateStr) {
    if (!dateStr) return "";

    // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }

    // Convertir DD/MM/YYYY a YYYY-MM-DD
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return dateStr;
  }

  // Convertir JSON a datos del formulario
  static jsonToForm(jsonData) {
    return {
      empleador: jsonData.empleador || "",
      rutEmpleador: jsonData.rutEmpleador || "",
      area: jsonData.area || "",
      mes: jsonData.mes || "",
      trabajador: {
        nombre: jsonData.trabajador?.nombre || "",
        rut: jsonData.trabajador?.rut || "",
        cargo: jsonData.trabajador?.cargo || "",
        tipoContrato: jsonData.trabajador?.tipoContrato || "",
        inicioContrato: this.convertDateFormat(
          jsonData.trabajador?.inicioContrato || ""
        ),
        diasTrabajados: jsonData.trabajador?.diasTrabajados || 30,
        diasVacaciones: jsonData.trabajador?.diasVacaciones || 0,
        sueldoBase: jsonData.trabajador?.sueldoBase || 0,
        prevision: jsonData.trabajador?.prevision || "",
        salud: jsonData.trabajador?.salud || "",
      },
      haberesImponibles: jsonData.haberesImponibles || [
        { concepto: "Sueldo Base", monto: 0 },
        { concepto: "Gratificación", monto: 0 },
      ],
      haberesNoImponibles: jsonData.haberesNoImponibles || [
        { concepto: "Movilización", monto: 0 },
        { concepto: "Colación", monto: 0 },
        { concepto: "Cargas Familiares", monto: 0 },
      ],
      descuentosLegales: jsonData.descuentosLegales || [
        { concepto: "AFP Provida", monto: 0 },
        { concepto: "Fonasa", monto: 0 },
        { concepto: "Seguro Desempleo", monto: 0 },
      ],
      otrosDescuentos: jsonData.otrosDescuentos || [
        { concepto: "Anticipos", monto: 0 },
        { concepto: "Préstamos", monto: 0 },
      ],
    };
  }

  // Crear estructura de datos vacía
  static createEmptyFormData() {
    return this.jsonToForm({});
  }
}
