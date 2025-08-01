/**
 * Servicio centralizado para transformar datos de diferentes fuentes
 * al formato estándar del generador de liquidaciones
 */
export class DataTransformService {
  
  /**
   * Formato estándar esperado por el generador
   */
  static getStandardFormat() {
    return {
      empleador: '',
      rutEmpleador: '',
      area: '',
      mes: '',
      trabajador: {
        nombre: '',
        rut: '',
        cargo: '',
        tipoContrato: '',
        inicioContrato: '',
        diasTrabajados: 30,
        diasVacaciones: 0,
        sueldoBase: 0,
        prevision: '',
        salud: ''
      },
      haberesImponibles: [],
      haberesNoImponibles: [],
      descuentosLegales: [],
      otrosDescuentos: [],
      totales: {
        totalHaberes: 0,
        totalDescuentos: 0,
        liquidoAPagar: 0
      }
    }
  }

  /**
   * Transformar datos del formulario al formato estándar
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Datos en formato estándar
   */
  static fromForm(formData) {
    return {
      empleador: formData.empleador || '',
      rutEmpleador: formData.rutEmpleador || '',
      area: formData.area || '',
      mes: formData.mes || '',
      trabajador: {
        nombre: formData.trabajador?.nombre || '',
        rut: formData.trabajador?.rut || '',
        cargo: formData.trabajador?.cargo || '',
        tipoContrato: formData.trabajador?.tipoContrato || '',
        inicioContrato: this.formatDate(formData.trabajador?.inicioContrato) || '',
        diasTrabajados: formData.trabajador?.diasTrabajados || 30,
        diasVacaciones: formData.trabajador?.diasVacaciones || 0,
        sueldoBase: formData.trabajador?.sueldoBase || 0,
        prevision: formData.trabajador?.prevision || '',
        salud: formData.trabajador?.salud || ''
      },
      haberesImponibles: this.filterValidItems(formData.haberesImponibles || []),
      haberesNoImponibles: this.filterValidItems(formData.haberesNoImponibles || []),
      descuentosLegales: this.filterValidItems(formData.descuentosLegales || []),
      otrosDescuentos: this.filterValidItems(formData.otrosDescuentos || []),
      totales: this.calculateTotals(formData)
    }
  }

  /**
   * Transformar datos de Excel al formato estándar
   * @param {Object} excelData - Datos del Excel procesado
   * @returns {Object} - Datos en formato estándar
   */
  static fromExcel(excelData) {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    return {
      empleador: excelData.empleador?.razonSocial || 'Empresa No Especificada',
      rutEmpleador: excelData.empleador?.rut || '12345678-9',
      area: 'Área General',
      mes: monthNames[excelData.periodo?.mes - 1] || 'Enero',
      trabajador: {
        nombre: excelData.trabajador?.nombre || '',
        rut: excelData.trabajador?.rut || '',
        cargo: excelData.trabajador?.cargo || 'Trabajador',
        tipoContrato: 'Indefinido',
        inicioContrato: excelData.trabajador?.fechaIngreso || '2024-01-01',
        diasTrabajados: 30,
        diasVacaciones: 0,
        sueldoBase: excelData.haberes?.sueldoBase || 0,
        prevision: 'AFP Provida',
        salud: 'Fonasa'
      },
      haberesImponibles: this.buildHaberesFromExcel(excelData.haberes),
      haberesNoImponibles: this.buildHaberesNoImponiblesFromExcel(excelData.haberes),
      descuentosLegales: this.buildDescuentosLegalesFromExcel(excelData.descuentos),
      otrosDescuentos: this.buildOtrosDescuentosFromExcel(excelData.descuentos),
      totales: this.calculateTotalsFromExcel(excelData)
    }
  }

  /**
   * Validar y normalizar datos JSON directos
   * @param {Object} jsonData - Datos JSON
   * @returns {Object} - Datos en formato estándar
   */
  static fromJSON(jsonData) {
    // Si ya está en formato estándar, solo validar y completar campos faltantes
    const standard = this.getStandardFormat()
    
    return {
      empleador: jsonData.empleador || standard.empleador,
      rutEmpleador: jsonData.rutEmpleador || standard.rutEmpleador,
      area: jsonData.area || standard.area,
      mes: jsonData.mes || standard.mes,
      trabajador: {
        ...standard.trabajador,
        ...jsonData.trabajador
      },
      haberesImponibles: this.filterValidItems(jsonData.haberesImponibles || []),
      haberesNoImponibles: this.filterValidItems(jsonData.haberesNoImponibles || []),
      descuentosLegales: this.filterValidItems(jsonData.descuentosLegales || []),
      otrosDescuentos: this.filterValidItems(jsonData.otrosDescuentos || []),
      totales: jsonData.totales || this.calculateTotalsFromStandard(jsonData)
    }
  }

  /**
   * Construir haberes imponibles desde datos de Excel
   */
  static buildHaberesFromExcel(haberes) {
    const items = []
    
    if (haberes?.sueldoBase > 0) {
      items.push({ concepto: 'Sueldo Base', monto: haberes.sueldoBase })
    }
    if (haberes?.horasExtra > 0 && haberes?.valorHoraExtra > 0) {
      items.push({ 
        concepto: 'Horas Extra', 
        monto: haberes.horasExtra * haberes.valorHoraExtra 
      })
    }
    if (haberes?.bonos > 0) {
      items.push({ concepto: 'Bonos', monto: haberes.bonos })
    }
    if (haberes?.comision > 0) {
      items.push({ concepto: 'Comisión', monto: haberes.comision })
    }
    
    return items
  }

  /**
   * Construir haberes no imponibles desde datos de Excel
   */
  static buildHaberesNoImponiblesFromExcel(haberes) {
    const items = []
    
    if (haberes?.otrosHaberes > 0) {
      items.push({ concepto: 'Otros Haberes', monto: haberes.otrosHaberes })
    }
    
    return items
  }

  /**
   * Construir descuentos legales desde datos de Excel
   */
  static buildDescuentosLegalesFromExcel(descuentos) {
    const items = []
    
    if (descuentos?.descuentoAFP > 0) {
      items.push({ concepto: 'AFP', monto: descuentos.descuentoAFP })
    }
    if (descuentos?.descuentoSalud > 0) {
      items.push({ concepto: 'Salud', monto: descuentos.descuentoSalud })
    }
    
    return items
  }

  /**
   * Construir otros descuentos desde datos de Excel
   */
  static buildOtrosDescuentosFromExcel(descuentos) {
    const items = []
    
    if (descuentos?.otrosDescuentos > 0) {
      items.push({ concepto: 'Otros Descuentos', monto: descuentos.otrosDescuentos })
    }
    
    return items
  }

  /**
   * Filtrar items válidos (que tengan concepto)
   */
  static filterValidItems(items) {
    return items.filter(item => item.concepto?.trim())
  }

  /**
   * Formatear fecha
   */
  static formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL')
  }

  /**
   * Calcular totales desde datos del formulario
   */
  static calculateTotals(formData) {
    const totalHaberesImponibles = this.sumItems(formData.haberesImponibles || [])
    const totalHaberesNoImponibles = this.sumItems(formData.haberesNoImponibles || [])
    const totalDescuentosLegales = this.sumItems(formData.descuentosLegales || [])
    const totalOtrosDescuentos = this.sumItems(formData.otrosDescuentos || [])
    
    return {
      totalHaberes: totalHaberesImponibles + totalHaberesNoImponibles,
      totalDescuentos: totalDescuentosLegales + totalOtrosDescuentos,
      liquidoAPagar: (totalHaberesImponibles + totalHaberesNoImponibles) - (totalDescuentosLegales + totalOtrosDescuentos)
    }
  }

  /**
   * Calcular totales desde datos de Excel
   */
  static calculateTotalsFromExcel(excelData) {
    const totalHaberes = Object.values(excelData.haberes || {})
      .reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0)
    
    const totalDescuentos = Object.values(excelData.descuentos || {})
      .reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0)
    
    return {
      totalHaberes,
      totalDescuentos,
      liquidoAPagar: totalHaberes - totalDescuentos
    }
  }

  /**
   * Calcular totales desde datos estándar
   */
  static calculateTotalsFromStandard(data) {
    const totalHaberesImponibles = this.sumItems(data.haberesImponibles || [])
    const totalHaberesNoImponibles = this.sumItems(data.haberesNoImponibles || [])
    const totalDescuentosLegales = this.sumItems(data.descuentosLegales || [])
    const totalOtrosDescuentos = this.sumItems(data.otrosDescuentos || [])
    
    return {
      totalHaberes: totalHaberesImponibles + totalHaberesNoImponibles,
      totalDescuentos: totalDescuentosLegales + totalOtrosDescuentos,
      liquidoAPagar: (totalHaberesImponibles + totalHaberesNoImponibles) - (totalDescuentosLegales + totalOtrosDescuentos)
    }
  }

  /**
   * Sumar items de un array
   */
  static sumItems(items) {
    return items.reduce((sum, item) => sum + (item.monto || 0), 0)
  }

  /**
   * Generar nombre de archivo estándar
   */
  static generateFileName(data) {
    const mes = data.mes?.toLowerCase().replace(/\s+/g, '-') || 'mes'
    const rut = data.trabajador?.rut?.replace(/[^\d]/g, '') || 'rut'
    const nombre = data.trabajador?.nombre?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s]/g, '') // Solo letras, números y espacios
      .replace(/\s+/g, '-') // Reemplazar espacios por guiones
      .substring(0, 20) || 'nombre'
    
    return `liq-${mes}-${rut}-${nombre}.pdf`
  }
}
