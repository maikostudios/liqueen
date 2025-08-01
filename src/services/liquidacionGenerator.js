// Servicio para generar el HTML de la liquidación

export class LiquidacionGenerator {
  static formatMoney(amount) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  }

  static escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remover caracteres de control
  }

  static generateHTML(data, logoBase64 = null) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liquidación de Sueldo - ${this.escapeHtml(
      data.trabajador.nombre
    )}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            font-size: 13px;
            color: #333;
        }

        h1 {
            font-size: 20px;
            margin-bottom: 5px;
        }

        h2 {
            font-size: 14px;
            margin-top: 20px;
            margin-bottom: 5px;
            color: #444;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header .logo {
            font-size: 18px;
            font-weight: bold;
            color: #E84A27;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .info-table td {
            padding: 4px;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
        }

        .section {
            margin-top: 20px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }

        .table th,
        .table td {
            padding: 6px;
            border: 1px solid #ccc;
        }

        .table th {
            background-color: #f3f3f3;
            text-align: left;
        }

        .table tfoot td {
            font-weight: bold;
            background-color: #f3f3f3;
        }

        .totales {
            display: flex;
            gap: 20px;
            margin-top: 15px;
        }

        .totales div {
            flex: 1;
            padding: 8px;
            background-color: #e8ecf8;
            font-weight: bold;
        }

        .resumen {
            background-color: #f3f3f3;
            padding: 6px;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-top: 5px;
        }

        .liquido {
            background-color: #d8e5ff;
            padding: 10px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
        }

        .firma {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
        }

        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #E84A27;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            z-index: 1000;
        }

        .print-button:hover {
            background-color: #d63916;
        }

        @media print {
            .print-button {
                display: none;
            }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>

    <div class="header">
        <div>
            <h1>Liquidación de Sueldo</h1>
            <div><span class="label">Empleador:</span> ${this.escapeHtml(
              data.empleador
            )} (${this.escapeHtml(data.rutEmpleador)})</div>
            <div><span class="label">Área:</span> ${this.escapeHtml(
              data.area
            )}</div>
            <div><span class="label">Mes:</span> ${this.escapeHtml(
              data.mes
            )}</div>
        </div>
        <div class="logo">
            ${
              logoBase64
                ? `<img src="${logoBase64}" alt="Logo Empresa" style="height: 80px; width: auto; object-fit: contain;" />`
                : `<div style="height: 80px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">Sin logo</div>`
            }
        </div>
    </div>

    <table class="info-table">
        <tr>
            <td><span class="label">Sr(a):</span> ${this.escapeHtml(
              data.trabajador.nombre
            )}</td>
            <td><span class="label">Tipo Contrato:</span> ${this.escapeHtml(
              data.trabajador.tipoContrato
            )}</td>
            <td><span class="label">Previsión:</span> ${this.escapeHtml(
              data.trabajador.prevision
            )}</td>
        </tr>
        <tr>
            <td><span class="label">RUT:</span> ${this.escapeHtml(
              data.trabajador.rut
            )}</td>
            <td><span class="label">Inicio Contrato:</span> ${this.escapeHtml(
              data.trabajador.inicioContrato
            )}</td>
            <td><span class="label">Salud:</span> ${this.escapeHtml(
              data.trabajador.salud
            )}</td>
        </tr>
        <tr>
            <td><span class="label">Cargo:</span> ${this.escapeHtml(
              data.trabajador.cargo
            )}</td>
            <td><span class="label">Días Trabajados:</span> ${
              data.trabajador.diasTrabajados
            }</td>
            <td></td>
        </tr>
        <tr>
            <td><span class="label">Sueldo Base:</span> ${this.formatMoney(
              data.trabajador.sueldoBase
            )}</td>
            <td><span class="label">Días Vacaciones Tomados:</span> ${
              data.trabajador.diasVacaciones
            }</td>
            <td></td>
        </tr>
    </table>

    <div style="display: flex; gap: 20px;" class="section">
        <div style="flex: 1;">
            <h2>HABERES IMPONIBLES</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.haberesImponibles
                      .map(
                        (item) => `
                        <tr>
                            <td>${item.concepto}</td>
                            <td>${this.formatMoney(item.monto)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total Haberes Imponibles</td>
                        <td>${this.formatMoney(
                          data.haberesImponibles.reduce(
                            (sum, item) => sum + item.monto,
                            0
                          )
                        )}</td>
                    </tr>
                </tfoot>
            </table>

            <h2>HABERES NO IMPONIBLES</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.haberesNoImponibles
                      .map(
                        (item) => `
                        <tr>
                            <td>${item.concepto}</td>
                            <td>${this.formatMoney(item.monto)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total Haberes No Imponibles</td>
                        <td>${this.formatMoney(
                          data.haberesNoImponibles.reduce(
                            (sum, item) => sum + item.monto,
                            0
                          )
                        )}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div style="flex: 1;">
            <h2>DESCUENTOS LEGALES</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.descuentosLegales
                      .map(
                        (item) => `
                        <tr>
                            <td>${item.concepto}</td>
                            <td>${this.formatMoney(item.monto)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total Descuentos Legales</td>
                        <td>${this.formatMoney(
                          data.descuentosLegales.reduce(
                            (sum, item) => sum + item.monto,
                            0
                          )
                        )}</td>
                    </tr>
                </tfoot>
            </table>

            <h2>OTROS DESCUENTOS</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.otrosDescuentos
                      .map(
                        (item) => `
                        <tr>
                            <td>${item.concepto}</td>
                            <td>${this.formatMoney(item.monto)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total Otros Descuentos</td>
                        <td>${this.formatMoney(
                          data.otrosDescuentos.reduce(
                            (sum, item) => sum + item.monto,
                            0
                          )
                        )}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <div class="totales">
        <div>Total Haberes: ${this.formatMoney(data.totales.totalHaberes)}</div>
        <div>Total Descuentos: ${this.formatMoney(
          data.totales.totalDescuentos
        )}</div>
    </div>

    <div class="resumen">
        <div>IMP. PREV./SALUD: ${this.formatMoney(
          data.totales.impPrevSalud
        )}</div>
        <div>SEGURO DESEMPLEO: ${this.formatMoney(
          data.totales.impSeguroDesempleo
        )}</div>
        <div>BASE TRIBUTABLE: ${this.formatMoney(
          data.totales.baseTributable
        )}</div>
    </div>

    <div class="liquido">LÍQUIDO A RECIBIR: ${this.formatMoney(
      data.totales.liquido
    )}</div>

    <p>Certifico que he recibido de ${data.empleador} (${
      data.rutEmpleador
    }) a mi entera satisfacción el saldo indicado en la
        presente Liquidación y no tengo cargo ni cobro posterior que hacer.</p>

    <div class="firma">_________________________<br>FIRMA CONFORME</div>

</body>
</html>
    `;
  }

  static generateAndOpen(data, logoBase64 = null) {
    // Calcular totales si no existen
    if (!data.totales) {
      // Calcular totales manualmente
      const totalHaberesImponibles =
        data.haberesImponibles?.reduce(
          (sum, item) => sum + (item.monto || 0),
          0
        ) || 0;
      const totalHaberesNoImponibles =
        data.haberesNoImponibles?.reduce(
          (sum, item) => sum + (item.monto || 0),
          0
        ) || 0;
      const totalDescuentosLegales =
        data.descuentosLegales?.reduce(
          (sum, item) => sum + (item.monto || 0),
          0
        ) || 0;
      const totalOtrosDescuentos =
        data.otrosDescuentos?.reduce(
          (sum, item) => sum + (item.monto || 0),
          0
        ) || 0;

      data.totales = {
        totalHaberes: totalHaberesImponibles + totalHaberesNoImponibles,
        totalDescuentos: totalDescuentosLegales + totalOtrosDescuentos,
        impPrevSalud: totalDescuentosLegales,
        impSeguroDesempleo: 0,
        baseTributable: totalHaberesImponibles,
        liquido:
          totalHaberesImponibles +
          totalHaberesNoImponibles -
          (totalDescuentosLegales + totalOtrosDescuentos),
      };
    }

    const html = this.generateHTML(data, logoBase64);
    const nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.write(html);
    nuevaVentana.document.close();
  }

  /**
   * Generar y guardar liquidación como PDF
   * @param {Object} data - Datos de la liquidación
   * @param {string} logoBase64 - Logo en base64 (opcional)
   * @param {string} folderPath - Ruta de la carpeta donde guardar
   * @param {string} fileName - Nombre del archivo
   */
  static async generateAndSave(
    data,
    logoBase64 = null,
    folderPath = null,
    fileName = null
  ) {
    try {
      // Transformar datos del Excel al formato esperado
      if (data.haberes && !Array.isArray(data.haberesImponibles)) {
        data.haberesImponibles = [];

        // Convertir haberes del Excel a formato de array
        if (data.haberes.sueldoBase > 0) {
          data.haberesImponibles.push({
            concepto: "Sueldo Base",
            monto: data.haberes.sueldoBase,
          });
        }

        if (data.haberes.horasExtra > 0 && data.haberes.valorHoraExtra > 0) {
          data.haberesImponibles.push({
            concepto: `Horas Extra (${data.haberes.horasExtra}h)`,
            monto: data.haberes.horasExtra * data.haberes.valorHoraExtra,
          });
        }

        if (data.haberes.bonos > 0) {
          data.haberesImponibles.push({
            concepto: "Bonos",
            monto: data.haberes.bonos,
          });
        }

        if (data.haberes.comision > 0) {
          data.haberesImponibles.push({
            concepto: "Comisión",
            monto: data.haberes.comision,
          });
        }

        if (data.haberes.asignacionFamiliar > 0) {
          data.haberesImponibles.push({
            concepto: "Asignación Familiar",
            monto: data.haberes.asignacionFamiliar,
          });
        }
      }

      // Transformar descuentos si es necesario
      if (data.descuentos && !Array.isArray(data.descuentos)) {
        const descuentosArray = [];

        if (data.descuentos.diasAusencia > 0) {
          const montoDescuento =
            ((data.haberes?.sueldoBase || 0) / 30) *
            data.descuentos.diasAusencia;
          descuentosArray.push({
            concepto: `Días de Ausencia (${data.descuentos.diasAusencia})`,
            monto: montoDescuento,
          });
        }

        if (data.descuentos.descuentoSalud > 0) {
          descuentosArray.push({
            concepto: "Descuento Salud",
            monto: data.descuentos.descuentoSalud,
          });
        }

        if (data.descuentos.descuentoAFP > 0) {
          descuentosArray.push({
            concepto: "Descuento AFP",
            monto: data.descuentos.descuentoAFP,
          });
        }

        if (data.descuentos.otrosDescuentos > 0) {
          descuentosArray.push({
            concepto: "Otros Descuentos",
            monto: data.descuentos.otrosDescuentos,
          });
        }

        // Reemplazar el objeto descuentos con el array
        data.descuentos = descuentosArray;
      }

      // Asegurar que haberesNoImponibles sea un array
      if (!Array.isArray(data.haberesNoImponibles)) {
        data.haberesNoImponibles = [];
      }

      // Asegurar que descuentosLegales sea un array
      if (!Array.isArray(data.descuentosLegales)) {
        data.descuentosLegales = [];
      }

      // Asegurar que otrosDescuentos sea un array
      if (!Array.isArray(data.otrosDescuentos)) {
        data.otrosDescuentos = [];
      }

      // Debug: verificar que todos los arrays estén inicializados
      console.log("🔍 Arrays verificados:", {
        haberesImponibles: Array.isArray(data.haberesImponibles),
        haberesNoImponibles: Array.isArray(data.haberesNoImponibles),
        descuentosLegales: Array.isArray(data.descuentosLegales),
        otrosDescuentos: Array.isArray(data.otrosDescuentos),
      });

      // Calcular totales si no existen
      if (!data.totales) {
        // Calcular totales manualmente
        const totalHaberesImponibles =
          data.haberesImponibles?.reduce(
            (sum, item) => sum + (item.monto || 0),
            0
          ) || 0;
        const totalHaberesNoImponibles = Array.isArray(data.haberesNoImponibles)
          ? data.haberesNoImponibles.reduce(
              (sum, item) => sum + (item.monto || 0),
              0
            )
          : 0;

        const totalDescuentos = (() => {
          if (Array.isArray(data.descuentos)) {
            return data.descuentos.reduce(
              (sum, item) => sum + (item.monto || 0),
              0
            );
          } else if (data.descuentos && typeof data.descuentos === "object") {
            // Si descuentos es un objeto, sumar todas sus propiedades numéricas
            return Object.values(data.descuentos).reduce((sum, value) => {
              return sum + (typeof value === "number" ? value : 0);
            }, 0);
          }
          return 0;
        })();

        data.totales = {
          haberesImponibles: totalHaberesImponibles,
          haberesNoImponibles: totalHaberesNoImponibles,
          totalHaberes: totalHaberesImponibles + totalHaberesNoImponibles,
          totalDescuentos: totalDescuentos,
          liquidoAPagar:
            totalHaberesImponibles + totalHaberesNoImponibles - totalDescuentos,
        };
      }

      const html = this.generateHTML(data, logoBase64);

      if (window.electronAPI) {
        // En Electron, usar el API nativo para guardar PDF
        console.log("📄 Generando PDF para:", data.trabajador.nombre);
        console.log("📁 Carpeta destino:", folderPath);
        console.log("📄 Nombre archivo:", fileName);

        // Limpiar el HTML de caracteres problemáticos
        const cleanHtml = html
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remover caracteres de control
          .replace(/\s+/g, " ") // Normalizar espacios
          .trim();

        const result = await window.electronAPI.savePDF({
          html: cleanHtml,
          folderPath: folderPath,
          fileName: fileName,
          options: {
            format: "A4",
            printBackground: true,
            margin: {
              top: "1cm",
              bottom: "1cm",
              left: "1cm",
              right: "1cm",
            },
          },
        });

        console.log("✅ Resultado PDF:", result);
        return result;
      } else {
        // Fallback para desarrollo web - mostrar HTML en consola
        console.log("📄 HTML generado para:", data.trabajador.nombre);
        console.log("🔗 Para ver el PDF, copia este HTML en un archivo .html");

        // Simular guardado exitoso
        return {
          success: true,
          message: "PDF generado (solo disponible en Electron)",
          path: "Desarrollo web - usar Electron para PDFs",
        };
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generar múltiples PDFs de forma secuencial
   * @param {Array} liquidaciones - Array de liquidaciones
   * @param {string} logoBase64 - Logo en base64 (opcional)
   * @param {string} folderPath - Ruta de la carpeta donde guardar
   * @param {Function} progressCallback - Callback para reportar progreso
   */
  static async generateMultiplePDFs(
    liquidaciones,
    logoBase64 = null,
    folderPath = null,
    progressCallback = null
  ) {
    const results = [];

    for (let i = 0; i < liquidaciones.length; i++) {
      const liquidacion = liquidaciones[i];

      try {
        // Generar nombre de archivo
        const fileName = this.generateFileName(liquidacion);

        // Reportar progreso
        if (progressCallback) {
          progressCallback({
            current: i + 1,
            total: liquidaciones.length,
            fileName: fileName,
            trabajador: liquidacion.trabajador.nombre,
          });
        }

        // Generar PDF
        const result = await this.generateAndSave(
          liquidacion,
          logoBase64,
          folderPath,
          fileName
        );

        results.push({
          liquidacion: liquidacion,
          fileName: fileName,
          result: result,
        });

        // Pequeña pausa para no sobrecargar el sistema
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `Error generating PDF for ${liquidacion.trabajador.nombre}:`,
          error
        );
        results.push({
          liquidacion: liquidacion,
          fileName: `error-${i}.pdf`,
          result: {
            success: false,
            error: error.message,
          },
        });
      }
    }

    return results;
  }

  /**
   * Generar nombre de archivo para liquidación
   * @param {Object} liquidacion - Datos de la liquidación
   * @returns {string} - Nombre del archivo
   */
  static generateFileName(liquidacion) {
    try {
      const { trabajador, periodo } = liquidacion;

      // Obtener mes y año
      const mes = String(periodo.mes).padStart(2, "0");
      const año = periodo.año;

      // Limpiar RUT (solo números y dígito verificador)
      const rutLimpio = trabajador.rut
        .replace(/[^\dkK-]/g, "")
        .replace(/-/g, "");

      // Limpiar nombre (solo letras, números y espacios, luego reemplazar espacios por guiones)
      let nombreLimpio = trabajador.nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/[^\w\s]/g, "") // Solo letras, números y espacios
        .replace(/\s+/g, "-") // Reemplazar espacios por guiones
        .toLowerCase();

      // Limitar longitud del nombre para evitar nombres muy largos
      if (nombreLimpio.length > 20) {
        nombreLimpio = nombreLimpio.substring(0, 20);
      }

      // Construir nombre del archivo
      const fileName = `liq-${mes}-${año}-${rutLimpio}-${nombreLimpio}.pdf`;

      // Validar longitud total (máximo 100 caracteres para compatibilidad)
      if (fileName.length > 100) {
        // Recortar nombre si es muy largo
        const maxNombreLength =
          100 - `liq-${mes}-${año}-${rutLimpio}-.pdf`.length;
        const nombreRecortado = nombreLimpio.substring(
          0,
          Math.max(5, maxNombreLength)
        );
        return `liq-${mes}-${año}-${rutLimpio}-${nombreRecortado}.pdf`;
      }

      return fileName;
    } catch (error) {
      console.error("Error generating file name:", error);
      // Nombre de fallback
      const timestamp = Date.now();
      return `liquidacion-${timestamp}.pdf`;
    }
  }
}
