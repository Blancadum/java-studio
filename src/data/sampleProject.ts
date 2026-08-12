import { JavaFile, AnalysisResult } from './types';

export const SAMPLE_TEACHER_DOC = `# INFORME DE EVALUACIÓN - PROYECTO JAVA II
**Profe:** Dra. María Carmen Rodríguez
**Asignatura:** Programación Orientada a Objetos y Java II
**Estado actual del proyecto:** REPROBADO (SUSPENDIDO - Requiere Subsanación)

---

### OBSERVACIONES Y REQUISITOS OBLIGATORIOS PARA APROBAR:

1. **Gestión de Excepciones Personalizadas (CRÍTICO):**
   - No se deben capturar excepciones genéricas con \`catch (Exception e)\`. Debe implementarse una jerarquía de excepciones propias (p. ej. \`ReservaInvalidaException\`, \`SaldoInsuficienteException\`).
   - Todos los métodos de servicio deben relanzar o tratar adecuadamente las excepciones específicas e incluir mensajes descriptivos.

2. **Polimorfismo y Principios de Diseño POO (CRÍTICO):**
   - La clase \`GestionClientes\` y \`GestionReservas\` contiene código duplicado e instancias directas. Se debe definir una interfaz \`IReservable\` o \`Gestionable<T>\` utilizando **Genéricos en Java**.
   - Se debe aplicar el principio de Encapsulamiento (revisar atributos públicos en \`Vehiculo.java\`).

3. **Uso de Colecciones y Java Streams (RECOMENDADO):**
   - Sustituir los bucles tradicionales \`for(int i=0; i < list.size(); i++)\` por la API de **Streams** (\`filter\`, \`map\`, \`collect\`, \`Optional\`) para mejorar la expresividad y legibilidad del código.

4. **Pruebas Unitarias JUnit 5 (OBLIGATORIO):**
   - El proyecto no incluye pruebas unitarias. Se exige al menos una clase de prueba JUnit 5 (\`ReservaServiceTest.java\`) que compruebe los casos de éxito y las excepciones lanzadas.

5. **Documentación y Javadoc (RECOMENDADO):**
   - Documentar con Javadoc los métodos públicos principales y añadir el bloque de manejo de recursos \`try-with-resources\` en la lectura de archivos/persistencia.
`;

export const SAMPLE_NO_FILES: JavaFile[] = [
  {
    id: 'no-1',
    name: 'Vehiculo.java',
    path: 'com/universidad/modelo/Vehiculo.java',
    version: 'Zip_original',
    content: `package com.universidad.modelo;

public class Vehiculo {
    public String matricula; // ERROR: Atributo público expuesto
    public String modelo;
    public double precioPorDia;
    public boolean disponible;

    public Vehiculo(String matricula, String modelo, double precioPorDia) {
        this.matricula = matricula;
        this.modelo = modelo;
        this.precioPorDia = precioPorDia;
        this.disponible = true;
    }
}
`
  },
  {
    id: 'no-2',
    name: 'ReservaService.java',
    path: 'com/universidad/servicio/ReservaService.java',
    version: 'Zip_original',
    content: `package com.universidad.servicio;

import com.universidad.modelo.Vehiculo;
import java.util.ArrayList;

public class ReservaService {
    private ArrayList lista = new ArrayList(); // ERROR: Sin genéricos <Vehiculo>

    public void agregarVehiculo(Object v) {
        lista.add(v);
    }

    public Vehiculo buscarPorMatricula(String mat) {
        try {
            for (int i = 0; i < lista.size(); i++) {
                Vehiculo v = (Vehiculo) lista.get(i);
                if (v.matricula.equals(mat)) {
                    return v;
                }
            }
        } catch (Exception e) {
            // ERROR: Catch genérico vacío
            System.out.println("Error genérico");
        }
        return null;
    }

    public double calcularPrecioTotal(String mat, int dias) {
        Vehiculo v = buscarPorMatricula(mat);
        if (v == null) {
            return -1; // ERROR: Retorna código de error en lugar de excepción
        }
        return v.precioPorDia * dias;
    }
}
`
  }
];

export const SAMPLE_FIXED_FILES: JavaFile[] = [
  {
    id: 'fixed-1',
    name: 'Vehiculo.java',
    path: 'com/universidad/modelo/Vehiculo.java',
    version: 'Zip_fixed',
    content: `package com.universidad.modelo;

public class Vehiculo {
    private String matricula;
    private String modelo;
    private double precioPorDia;
    private boolean disponible;

    public Vehiculo(String matricula, String modelo, double precioPorDia) {
        this.matricula = matricula;
        this.modelo = modelo;
        this.precioPorDia = precioPorDia;
        this.disponible = true;
    }

    public String getMatricula() { return matricula; }
    public String getModelo() { return modelo; }
    public double getPrecioPorDia() { return precioPorDia; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}
`
  },
  {
    id: 'fixed-2',
    name: 'ReservaService.java',
    path: 'com/universidad/servicio/ReservaService.java',
    version: 'Zip_fixed',
    content: `package com.universidad.servicio;

import com.universidad.modelo.Vehiculo;
import java.util.ArrayList;
import java.util.List;

public class ReservaService {
    private List<Vehiculo> lista = new ArrayList<>(); // Corregido genéricos

    public void agregarVehiculo(Vehiculo v) {
        lista.add(v);
    }

    public Vehiculo buscarPorMatricula(String mat) {
        for (Vehiculo v : lista) {
            if (v.getMatricula().equals(mat)) {
                return v;
            }
        }
        return null; // Aún retorna null en lugar de Optional o lanzar Excepción
    }

    public double calcularPrecioTotal(String mat, int dias) {
        Vehiculo v = buscarPorMatricula(mat);
        if (v == null) {
            throw new IllegalArgumentException("Vehículo no encontrado: " + mat); // Excepción estándar, pero falta excepción personalizada
        }
        return v.getPrecioPorDia() * dias;
    }
}
`
  }
];

export const INITIAL_SAMPLE_ANALYSIS: AnalysisResult = {
  overallScore: 72,
  passLikelihood: 'MEDIA',
  teacherComplianceScore: 68,
  summary: 'Se observan mejoras importantes en la versión Zip_fixed (encapsulamiento en Vehiculo y uso de genéricos List<Vehiculo>). Sin embargo, aún quedan requisitos clave indicados por tu profe sin cumplir del todo (falta jerarquía de excepciones personalizadas, uso de Java Streams y Pruebas JUnit 5).',
  keyStrengths: [
    'Atributos encapsulados correctamente con getters/setters en Vehiculo.java.',
    'Uso de genéricos List<Vehiculo> reemplazando ArrayList sin tipo.',
    'Se eliminó el bloque catch (Exception e) vacío.'
  ],
  criticalGaps: [
    'No se han creado excepciones personalizadas (p. ej. ReservaNotFoundException).',
    'No hay pruebas unitarias con JUnit 5 (ReservaServiceTest.java).',
    'Falta la implementación de la API de Streams y Optional para búsquedas más limpias.',
    'Falta documentación Javadoc en la capa de servicios.'
  ],
  recommendations: [
    {
      id: 'rec-1',
      title: 'Jerarquía de Excepciones Personalizadas',
      category: 'EXCEPTIONS',
      description: 'Crear la clase ReservaNotFoundException extends Exception e integrarla en ReservaService.',
      priority: 'CRITICAL',
      status: 'MISSING',
      teacherNote: 'No se deben capturar ni lanzar excepciones genéricas. Crear excepciones específicas.',
      location: 'com.universidad.excepcion.ReservaNotFoundException'
    },
    {
      id: 'rec-2',
      title: 'Encapsulamiento en modelos',
      category: 'OOP',
      description: 'Convertir atributos públicos a private con métodos getter/setter.',
      priority: 'CRITICAL',
      status: 'SATISFIED',
      teacherNote: 'Revisar atributos públicos en Vehiculo.java.',
      location: 'Vehiculo.java'
    },
    {
      id: 'rec-3',
      title: 'Uso de Java Streams y Optional',
      category: 'COLLECTIONS',
      description: 'Refactorizar buscarPorMatricula usando lista.stream().filter(...).findFirst().',
      priority: 'RECOMMENDED',
      status: 'PARTIAL',
      teacherNote: 'Sustituir bucles for tradicionales por la API de Streams.',
      location: 'ReservaService.java'
    },
    {
      id: 'rec-4',
      title: 'Pruebas Unitarias JUnit 5',
      category: 'TESTS',
      description: 'Crear ReservaServiceTest.java probando casos válidos y excepciones esperadas con assertThrows.',
      priority: 'CRITICAL',
      status: 'MISSING',
      teacherNote: 'Exigido al menos una clase de prueba JUnit 5.',
      location: 'src/test/java/ReservaServiceTest.java'
    },
    {
      id: 'rec-5',
      title: 'Documentación Javadoc',
      category: 'DOCUMENTATION',
      description: 'Añadir bloques Javadoc (@param, @return, @throws) en métodos públicos.',
      priority: 'RECOMMENDED',
      status: 'MISSING',
      teacherNote: 'Documentar con Javadoc métodos públicos.',
      location: 'ReservaService.java'
    }
  ],
  proposals: [
    {
      id: 'prop-1',
      fileTarget: 'com/universidad/excepcion/ReservaNotFoundException.java',
      issueTitle: 'Crear Excepción Personalizada ReservaNotFoundException',
      category: 'EXCEPTIONS',
      description: 'Satisface el requisito número 1 de tu profe sobre jerarquía de excepciones propias.',
      originalCode: '// No existía esta clase',
      proposedCode: `package com.universidad.excepcion;

/**
 * Excepción lanzada cuando no se encuentra un vehículo o reserva en el sistema.
 */
public class ReservaNotFoundException extends Exception {
    public ReservaNotFoundException(String mensaje) {
        super(mensaje);
    }
}`,
      explanation: 'Define una excepción comprobada específica con un mensaje claro que hereda de Exception.',
      fulfillsTeacherPoint: 'Requisito 1: Gestión de Excepciones Personalizadas',
      impact: 'HIGH'
    },
    {
      id: 'prop-2',
      fileTarget: 'com/universidad/servicio/ReservaService.java',
      issueTitle: 'Refactor con Java Streams, Optional y Excepción Propia',
      category: 'COLLECTIONS',
      description: 'Reemplaza el bucle for por Streams e integra ReservaNotFoundException y Javadoc.',
      originalCode: `public Vehiculo buscarPorMatricula(String mat) {
    for (Vehiculo v : lista) {
        if (v.getMatricula().equals(mat)) {
            return v;
        }
    }
    return null;
}`,
      proposedCode: `/**
 * Busca un vehículo por su matrícula utilizando Java Streams.
 *
 * @param mat Matrícula a buscar
 * @return Vehiculo encontrado
 * @throws ReservaNotFoundException Si no existe el vehículo
 */
public Vehiculo buscarPorMatricula(String mat) throws ReservaNotFoundException {
    return lista.stream()
            .filter(v -> v.getMatricula().equalsIgnoreCase(mat))
            .findFirst()
            .orElseThrow(() -> new ReservaNotFoundException("No se encontró el vehículo con matrícula: " + mat));
}`,
      explanation: 'Usa Java 8+ Stream API, case-insensitive string matching, y orElseThrow para un código funcional y limpio.',
      fulfillsTeacherPoint: 'Requisito 1 y 3: Excepciones y Java Streams',
      impact: 'HIGH'
    },
    {
      id: 'prop-3',
      fileTarget: 'src/test/java/com/universidad/servicio/ReservaServiceTest.java',
      issueTitle: 'Añadir Suite de Pruebas Unitarias JUnit 5',
      category: 'TESTS',
      description: 'Crea la clase de pruebas unitarias requerida por tu profe para garantizar el aprobado.',
      originalCode: '// No existen pruebas unitarias',
      proposedCode: `package com.universidad.servicio;

import com.universidad.excepcion.ReservaNotFoundException;
import com.universidad.modelo.Vehiculo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

public class ReservaServiceTest {
    private ReservaService reservaService;

    @BeforeEach
    void setUp() {
        reservaService = new ReservaService();
        reservaService.agregarVehiculo(new Vehiculo("1234ABC", "Toyota Corolla", 45.0));
    }

    @Test
    @DisplayName("Debe encontrar un vehículo existente por matrícula")
    void testBuscarPorMatriculaExitoso() throws ReservaNotFoundException {
        Vehiculo v = reservaService.buscarPorMatricula("1234ABC");
        assertNotNull(v);
        assertEquals("Toyota Corolla", v.getModelo());
    }

    @Test
    @DisplayName("Debe lanzar ReservaNotFoundException cuando la matrícula no existe")
    void testBuscarPorMatriculaNoEncontrado() {
        assertThrows(ReservaNotFoundException.class, () -> {
            reservaService.buscarPorMatricula("9999ZZZ");
        });
    }
}`,
      explanation: 'Usa marcas modernas de JUnit 5 (@Test, @BeforeEach, @DisplayName, assertThrows) para verificar casos de éxito y de error.',
      fulfillsTeacherPoint: 'Requisito 4: Pruebas Unitarias JUnit 5',
      impact: 'HIGH'
    }
  ],
  generalAdvice: [
    'Asegúrate de adjuntar los archivos .java actualizados en el ZIP final de entrega.',
    'Añade un archivo README.md o InformeJustificacion.pdf explicando cómo has atendido cada recomendación de tu profe.',
    'Verifica que la versión de Java utilizada en la configuración del proyecto (pom.xml o build.gradle) sea Java 17 o superior.'
  ]
};
