const ediciones = [
  { id: 'LMQ-001', modeloId: 'LMQ', variante: 'No Rusteze Spoiler', pais: 'Thailand', anio: 2006, imagen: 'images/mcqueennospoiler.png', presentaciones: [] },
  { id: 'LMQ-002', modeloId: 'LMQ', variante: 'No Rusteze Spoiler', pais: 'China', anio: 2007, imagen: 'images/mcqueennospoiler.png', presentaciones: [] },
  { id: 'LMQ-003', modeloId: 'LMQ', variante: 'No Rusteze Spoiler/Mouth Plate', pais: 'China', anio: 2007, imagen: '', presentaciones: [] },
  { id: 'LMQ-004', modeloId: 'LMQ', variante: 'Rusteze Spoiler', pais: 'China', anio: 2009, imagen: '', presentaciones: [] },
  { id: 'LMQ-005', modeloId: 'LMQ', variante: 'Rusteze Spoiler', pais: 'Thailand V2', anio: 2018, imagen: '', presentaciones: [] },
  { id: 'LMQ-006', modeloId: 'LMQ', variante: 'Rusteze Spoiler', pais: 'Vietnam', anio: 2020, imagen: '', presentaciones: [] },
  { id: 'LMQ-007', modeloId: 'LMQ', variante: 'Rusteze Spoiler', pais: 'China V2', anio: 2026, imagen: '', presentaciones: [] },

  { id: 'MAT-001', modeloId: 'MAT', variante: 'Full Metal Body/Brown Back Wheels', pais: 'Thailand', anio: 2006, imagen: 'images/mater.png', presentaciones: [] },
  { id: 'MAT-002', modeloId: 'MAT', variante: 'Plastic Back/Brown Back Wheels', pais: 'China', anio: 2007, imagen: '', presentaciones: [] },
  { id: 'MAT-003', modeloId: 'MAT', variante: 'Plastic Back/Colored Back Wheels', pais: 'China', anio: 2014, imagen: '', presentaciones: [] },
  { id: 'MAT-004', modeloId: 'MAT', variante: 'Full Metal Body/Colored Back Wheels', pais: 'Thailand V2', anio: 2018, imagen: '', presentaciones: [] },
  { id: 'MAT-005', modeloId: 'MAT', variante: 'Plastic Back/Colored Back Wheels', pais: 'Vietnam', anio: 2020, imagen: '', presentaciones: [] },
  { id: 'MAT-006', modeloId: 'MAT', variante: 'Working Tow Hook', pais: 'Thailand V2', anio: 2022, imagen: '', presentaciones: [] },
  { id: 'MAT-007', modeloId: 'MAT', variante: 'Working Tow Hook', pais: 'China V2', anio: 2026, imagen: '', presentaciones: [] },

  { id: 'SAL-001', modeloId: 'SAL', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/sally.png', presentaciones: [] },
  { id: 'DOC-001', modeloId: 'DOC', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/dochudson.png', presentaciones: [] },
  { id: 'SHE-001', modeloId: 'SHE', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/sheriff.png', presentaciones: [] },
  { id: 'LIZ-001', modeloId: 'LIZ', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/lizzie.png', presentaciones: [] },
  { id: 'CHICK-001', modeloId: 'CHICK', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/chick.png', presentaciones: [] },
  { id: 'KING-001', modeloId: 'KING', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/king.png', presentaciones: [] },

  { id: 'SAR-001', modeloId: 'SAR', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/sargeoriginal.png', presentaciones: [] },
  { id: 'SAR-002', modeloId: 'SAR', variante: 'Lead Paint', pais: 'China', anio: 2007, imagen: 'images/sargeoriginal.png', presentaciones: [] },

  { id: 'FIL-001', modeloId: 'FIL', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/fillmore.png', presentaciones: [] },
  { id: 'WIN-001', modeloId: 'WIN', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/wingo.png', presentaciones: [] },
  { id: 'DJ-001', modeloId: 'DJ', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/dj.png', presentaciones: [] },
  { id: 'TRA-001', modeloId: 'TRA', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/tractor.png', presentaciones: [] },
  { id: 'GUI-001', modeloId: 'GUI', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/guido.png', presentaciones: [] },
  { id: 'LUIGI-001', modeloId: 'LUIGI', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/luigi.png', presentaciones: [] },
  { id: 'SNOT-001', modeloId: 'SNOT', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/snotrod.png', presentaciones: [] },
  { id: 'BOOST-001', modeloId: 'BOOST', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/boost.png', presentaciones: [] },
  { id: 'RAM-PURPLE-001', modeloId: 'RAM-PURPLE', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/ramone-purple.png', presentaciones: [] },
  { id: 'FLO-001', modeloId: 'FLO', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/flo.png', presentaciones: [] },
  { id: 'RED-001', modeloId: 'RED', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/red.png', presentaciones: [] },
  { id: 'STANLEY-001', modeloId: 'STANLEY', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/stanley.png', presentaciones: [] },
  { id: 'DIN-MCQ-001', modeloId: 'DIN-MCQ', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/dinocomcqueen.png', presentaciones: [] },
  { id: 'RAM-GREEN-001', modeloId: 'RAM-GREEN', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/ramone-green.png', presentaciones: [] },
  { id: 'LEAKLESS-001', modeloId: 'LEAKLESS', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/leakless.png', presentaciones: [] },
  { id: 'NITROADE-001', modeloId: 'NITROADE', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/nitroade.png', presentaciones: [] },
  { id: 'DT-MCQ-001', modeloId: 'DT-MCQ', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/dirt-track-mcqueen.png', presentaciones: [] },
  { id: 'RB-MAT-001', modeloId: 'RB-MAT', variante: 'Standard', pais: 'Thailand', anio: 2006, imagen: 'images/rollin-bowlin-mater.png', presentaciones: [] }
];

ediciones.forEach(edicion => {
  if (typeof edicion.imagen === 'object' && edicion.imagen !== null) {
    edicion.imagen = edicion.imagen.src || '';
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ediciones;
}
