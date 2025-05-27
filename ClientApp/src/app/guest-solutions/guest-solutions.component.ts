import { Component } from '@angular/core';

@Component({
  selector: 'app-guest-solutions',
  templateUrl: './guest-solutions.component.html',
  styleUrls: ['./guest-solutions.component.scss']
})
export class GuestSolutionsComponent {
  areas = [
    { title: 'Administración', icon: '/assets/solutions/adm.jpg' },
    { title: 'Contabilidad', icon: '/assets/solutions/cont.jpg' },
    { title: 'Procesos Agrícolas', icon: '/assets/solutions/procAgri.jpg' },
    { title: 'Finanzas', icon: '/assets/solutions/Finan.jpg' },
    { title: 'Gestión Comercial', icon: '/assets/solutions/GestComer.jpg' },
    { title: 'Procesos Ganaderos', icon: '/assets/solutions/ProcGanaderos.jpg' }
  ];

  ventajas = [
    { icon: '/assets/solutions/organize.jpg', text: 'Organizá en forma completa, rápida y sencilla toda la información de tu producción agropecuaria.' },
    { icon: '/assets/solutions/increase.jpg', text: 'Aumentá ingresos y disminuí costos con análisis integral de tu campo.' },
    { icon: '/assets/solutions/pie.jpg', text: 'Conocé gastos y producción agrícola por campaña, cultivo, lote y hectárea.' },
    { icon: '/assets/solutions/bar.jpg', text: 'Compará costos ganaderos y de tambo mes a mes con datos simples.' },
    { icon: '/assets/solutions/machine.jpg', text: 'Control total de maquinaria: uso, mantenimiento y rentabilidad.' },
    { icon: '/assets/solutions/stocks.jpg', text: 'Consultá existencias de cereales, hacienda e insumos en tiempo real.' },
    { icon: '/assets/solutions/bank.jpg', text: 'Control de cuentas bancarias, vencimientos, clientes y proveedores.' },
    { icon: '/assets/solutions/form.jpg', text: 'Automatizá tu empresa agropecuaria gestionando con información.' }
  ];

  funcionalidades = [
    { icon: '/assets/solutions/purchase.jpg', text: 'Compras y Ventas.<br>Libros IVA. Cuentas Corrientes, Canje y más.' },
    { icon: '/assets/solutions/electronic-invoice.jpg', text: 'Facturación Electrónica. Retenciones. Exportaciones IVA.' },
    { icon: '/assets/solutions/farm.jpg', text: 'Remitos, stock de insumos, servicios a terceros, carta de porte, etc.' },
    { icon: '/assets/solutions/cow.jpg', text: 'Movimientos de hacienda, trazabilidad, producción lechera.' },
    { icon: '/assets/solutions/report.png', text: 'Informes contables y técnicos. Margen bruto. Índices de rentabilidad.' }
  ];

  implementacion = [
    'Te asignamos un capacitador que te asistirá en la implementación y puesta en marcha del software.',
    'Asistencia técnica y soporte para dudas, uso del software, datos y reportes.',
    'Mejora constante con actualizaciones según lo que los usuarios necesiten.'
  ];
}
