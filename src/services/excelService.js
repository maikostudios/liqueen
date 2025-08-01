import * as XLSX from "xlsx";

export class ExcelService {
  /**
   * Leer archivo Excel/Google Sheets y convertir a JSON
   * @param {File} file - Archivo Excel (.xlsx, .xls, .csv)
   * @returns {Promise<Object>} - Datos procesados
   */
  static async readExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          console.log("📖 Leyendo archivo Excel...");
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          console.log("📊 Hojas encontradas:", workbook.SheetNames);

          // Obtener la primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
            raw: false,
          });

          console.log("📋 Datos raw del Excel:", jsonData.slice(0, 5)); // Primeras 5 filas
          console.log("📏 Total de filas:", jsonData.length);

          // Procesar los datos
          const processedData = this.processExcelData(jsonData);

          console.log("✅ Datos procesados:", processedData);

          resolve({
            success: true,
            data: processedData,
            fileName: file.name,
            sheetName: sheetName,
          });
        } catch (error) {
          reject({
            success: false,
            error: "Error al procesar el archivo Excel: " + error.message,
          });
        }
      };

      reader.onerror = () => {
        reject({
          success: false,
          error: "Error al leer el archivo",
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Procesar datos del Excel y convertir al formato esperado
   * @param {Array} rawData - Datos crudos del Excel
   * @returns {Array} - Array de liquidaciones procesadas
   */
  static processExcelData(rawData) {
    console.log("🔄 Iniciando processExcelData con:", rawData.length, "filas");

    if (!rawData || rawData.length < 2) {
      console.error("❌ Datos insuficientes:", {
        rawData,
        length: rawData?.length,
      });
      throw new Error(
        "El archivo debe contener al menos una fila de encabezados y una fila de datos"
      );
    }

    // Primera fila son los encabezados
    const headers = rawData[0].map((header) =>
      String(header).trim().toLowerCase()
    );

    console.log("📋 Headers encontrados:", headers);

    // Mapeo de columnas esperadas
    const columnMapping = {
      // Datos del empleador
      empresa: ["empresa", "empleador", "razon_social", "razón social"],
      rut_empresa: [
        "rut_empresa",
        "rut empresa",
        "rut_empleador",
        "rut empleador",
      ],
      direccion_empresa: [
        "direccion_empresa",
        "dirección empresa",
        "direccion",
        "dirección",
      ],
      telefono_empresa: [
        "telefono_empresa",
        "teléfono empresa",
        "telefono",
        "teléfono",
      ],
      email_empresa: [
        "email_empresa",
        "email empresa",
        "correo_empresa",
        "correo empresa",
      ],

      // Datos del trabajador
      nombre: [
        "nombre",
        "nombre_trabajador",
        "nombre trabajador",
        "trabajador",
      ],
      rut: ["rut", "rut_trabajador", "rut trabajador"],
      cargo: ["cargo", "puesto", "posicion", "posición"],
      fecha_ingreso: ["fecha_ingreso", "fecha ingreso", "ingreso"],
      sueldo_base: ["sueldo_base", "sueldo base", "sueldo", "salario"],

      // Período
      mes: ["mes", "periodo_mes", "período mes"],
      año: ["año", "ano", "year", "periodo_año", "período año"],

      // Haberes adicionales
      horas_extra: ["horas_extra", "horas extra", "he"],
      valor_hora_extra: ["valor_hora_extra", "valor hora extra", "vhe"],
      bonos: ["bonos", "bono", "gratificacion", "gratificación"],
      comision: ["comision", "comisión", "comisiones"],
      otros_haberes: ["otros_haberes", "otros haberes", "otros"],

      // Descuentos
      dias_ausencia: ["dias_ausencia", "días ausencia", "ausencias", "faltas"],
      descuento_salud: [
        "descuento_salud",
        "descuento salud",
        "fonasa",
        "isapre",
      ],
      descuento_afp: ["descuento_afp", "descuento afp", "afp"],
      otros_descuentos: [
        "otros_descuentos",
        "otros descuentos",
        "descuentos_varios",
      ],
    };

    // Encontrar índices de columnas
    const columnIndexes = {};
    Object.keys(columnMapping).forEach((key) => {
      const possibleNames = columnMapping[key];
      const index = headers.findIndex((header) =>
        possibleNames.some((name) => header.includes(name))
      );
      if (index !== -1) {
        columnIndexes[key] = index;
        console.log(
          `✅ Columna encontrada: ${key} -> índice ${index} (header: "${headers[index]}")`
        );
      } else {
        console.log(
          `❌ Columna NO encontrada: ${key} (buscando: ${possibleNames.join(
            ", "
          )})`
        );
      }
    });

    console.log("📊 Mapeo final de columnas:", columnIndexes);

    // Procesar filas de datos
    const liquidaciones = [];

    for (let i = 1; i < rawData.length && liquidaciones.length < 10; i++) {
      const row = rawData[i];

      // Saltar filas vacías
      if (!row || row.every((cell) => !cell || String(cell).trim() === "")) {
        continue;
      }

      try {
        const liquidacion = this.createLiquidacionFromRow(row, columnIndexes);
        if (liquidacion) {
          liquidaciones.push(liquidacion);
        }
      } catch (error) {
        console.warn(`Error procesando fila ${i + 1}:`, error.message);
        // Continuar con la siguiente fila
      }
    }

    if (liquidaciones.length === 0) {
      throw new Error("No se encontraron datos válidos en el archivo");
    }

    return liquidaciones;
  }

  /**
   * Crear objeto de liquidación desde una fila del Excel
   * @param {Array} row - Fila de datos
   * @param {Object} columnIndexes - Mapeo de índices de columnas
   * @returns {Object} - Objeto de liquidación
   */
  static createLiquidacionFromRow(row, columnIndexes) {
    const getValue = (key, defaultValue = "") => {
      const index = columnIndexes[key];
      return index !== undefined && row[index] !== undefined
        ? String(row[index]).trim()
        : defaultValue;
    };

    const getNumericValue = (key, defaultValue = 0) => {
      const value = getValue(key);
      const numeric = parseFloat(value.replace(/[^\d.-]/g, ""));
      return isNaN(numeric) ? defaultValue : numeric;
    };

    // Validaciones básicas
    const nombre = getValue("nombre");
    const rut = getValue("rut");

    if (!nombre || !rut) {
      throw new Error("Nombre y RUT son obligatorios");
    }

    // Crear objeto de liquidación
    const liquidacion = {
      empleador: {
        razonSocial: getValue("empresa") || "Empresa No Especificada",
        rut: getValue("rut_empresa") || "12345678-9",
        direccion: getValue("direccion_empresa") || "Dirección No Especificada",
        telefono: getValue("telefono_empresa") || "+56912345678",
        email: getValue("email_empresa") || "contacto@empresa.cl",
      },
      trabajador: {
        nombre: nombre,
        rut: rut,
        cargo: getValue("cargo") || "Trabajador",
        fechaIngreso: this.parseDate(getValue("fecha_ingreso")) || "2024-01-01",
      },
      periodo: {
        mes: this.parseMonth(getValue("mes")) || new Date().getMonth() + 1,
        año: parseInt(getValue("año")) || new Date().getFullYear(),
      },
      haberes: {
        sueldoBase: getNumericValue("sueldo_base"),
        horasExtra: getNumericValue("horas_extra"),
        valorHoraExtra: getNumericValue("valor_hora_extra"),
        bonos: getNumericValue("bonos"),
        comision: getNumericValue("comision"),
        otrosHaberes: getNumericValue("otros_haberes"),
      },
      descuentos: {
        diasAusencia: getNumericValue("dias_ausencia"),
        descuentoSalud: getNumericValue("descuento_salud"),
        descuentoAFP: getNumericValue("descuento_afp"),
        otrosDescuentos: getNumericValue("otros_descuentos"),
      },
    };

    return liquidacion;
  }

  /**
   * Parsear fecha desde string
   * @param {string} dateStr - String de fecha
   * @returns {string} - Fecha en formato YYYY-MM-DD
   */
  static parseDate(dateStr) {
    if (!dateStr) return null;

    try {
      // Intentar varios formatos
      const formats = [
        /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
        /(\d{1,2})-(\d{1,2})-(\d{4})/, // DD-MM-YYYY
      ];

      for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
          if (format === formats[0]) {
            // YYYY-MM-DD
            return `${match[1]}-${match[2].padStart(
              2,
              "0"
            )}-${match[3].padStart(2, "0")}`;
          } else {
            // DD/MM/YYYY o DD-MM-YYYY
            return `${match[3]}-${match[2].padStart(
              2,
              "0"
            )}-${match[1].padStart(2, "0")}`;
          }
        }
      }

      // Si no coincide con ningún formato, intentar Date.parse
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    } catch (error) {
      console.warn("Error parsing date:", dateStr, error);
    }

    return null;
  }

  /**
   * Parsear mes desde string o número
   * @param {string|number} monthStr - Mes
   * @returns {number} - Número del mes (1-12)
   */
  static parseMonth(monthStr) {
    if (!monthStr) return null;

    const monthNames = {
      enero: 1,
      febrero: 2,
      marzo: 3,
      abril: 4,
      mayo: 5,
      junio: 6,
      julio: 7,
      agosto: 8,
      septiembre: 9,
      octubre: 10,
      noviembre: 11,
      diciembre: 12,
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    };

    const monthStr_lower = String(monthStr).toLowerCase().trim();

    // Si es un número
    const monthNum = parseInt(monthStr_lower);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      return monthNum;
    }

    // Si es un nombre de mes
    return monthNames[monthStr_lower] || null;
  }

  /**
   * Validar estructura del archivo Excel
   * @param {Array} headers - Encabezados del archivo
   * @returns {Object} - Resultado de validación
   */
  static validateExcelStructure(headers) {
    const requiredColumns = ["nombre", "rut", "sueldo_base"];
    const missingColumns = [];

    requiredColumns.forEach((required) => {
      const found = headers.some(
        (header) =>
          header.toLowerCase().includes(required.replace("_", " ")) ||
          header.toLowerCase().includes(required)
      );
      if (!found) {
        missingColumns.push(required);
      }
    });

    return {
      isValid: missingColumns.length === 0,
      missingColumns,
      message:
        missingColumns.length > 0
          ? `Faltan columnas requeridas: ${missingColumns.join(", ")}`
          : "Estructura válida",
    };
  }

  /**
   * Generar plantilla Excel de ejemplo
   * @returns {Blob} - Archivo Excel de plantilla
   */
  static generateTemplate() {
    const templateData = [
      // Encabezados
      [
        "Empresa",
        "RUT Empresa",
        "Dirección Empresa",
        "Teléfono Empresa",
        "Email Empresa",
        "Nombre",
        "RUT",
        "Cargo",
        "Fecha Ingreso",
        "Sueldo Base",
        "Mes",
        "Año",
        "Horas Extra",
        "Valor Hora Extra",
        "Bonos",
        "Comisión",
        "Otros Haberes",
        "Días Ausencia",
        "Descuento Salud",
        "Descuento AFP",
        "Otros Descuentos",
      ],
      // Ejemplo 1
      [
        "Mi Empresa SpA",
        "12345678-9",
        "Av. Principal 123",
        "+56912345678",
        "contacto@miempresa.cl",
        "Juan Pérez",
        "11111111-1",
        "Desarrollador",
        "2024-01-15",
        800000,
        "Enero",
        2024,
        10,
        15000,
        50000,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
      // Ejemplo 2
      [
        "Mi Empresa SpA",
        "12345678-9",
        "Av. Principal 123",
        "+56912345678",
        "contacto@miempresa.cl",
        "María González",
        "22222222-2",
        "Diseñadora",
        "2024-02-01",
        750000,
        "Enero",
        2024,
        5,
        15000,
        30000,
        10000,
        0,
        1,
        0,
        0,
        0,
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Liquidaciones");

    return XLSX.writeFile(workbook, "plantilla_liquidaciones.xlsx");
  }
}
