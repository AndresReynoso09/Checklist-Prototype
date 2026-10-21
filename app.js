const STORAGE_EDICIONES = 'diecast-estados-ediciones';
const STORAGE_PRESENTACIONES = 'diecast-estados-presentaciones';
const estadoEtiqueta = {
  'lo-tengo': 'Lo tengo',
  'lo-busco': 'Lo busco',
  'me-falta': 'Me falta'
};

const elementos = {
  catalogo: document.getElementById('catalogo'),
  busqueda: document.getElementById('busqueda'),
  filtroEstado: document.getElementById('filtroEstado'),
  filtroAnio: document.getElementById('filtroAnio'),
  presentacionesPorAnioContenido: document.getElementById('presentacionesPorAnioContenido'),
  menuTabs: document.querySelectorAll('.menu-nav .tab'),
  views: document.querySelectorAll('.view'),
  mensajeNoResultados: document.getElementById('mensajeNoResultados'),
  totalAutitos: document.getElementById('totalAutitos'),
  tengoAutitos: document.getElementById('tengoAutitos'),
  buscoAutitos: document.getElementById('buscoAutitos'),
  faltaAutitos: document.getElementById('faltaAutitos'),
  porcentajeCompletado: document.getElementById('porcentajeCompletado'),
  btnReiniciar: document.getElementById('btnReiniciar')
};

let estadosEdiciones = cargarEstados(STORAGE_EDICIONES);
let estadosPresentaciones = cargarEstados(STORAGE_PRESENTACIONES);
let estadoFiltroSeleccionado = 'todos';
let terminoBusqueda = '';

function cargarEstados(llave) {
  const valor = localStorage.getItem(llave);
  return valor ? JSON.parse(valor) : {};
}

function guardarEstados(llave, estados) {
  localStorage.setItem(llave, JSON.stringify(estados));
}

function obtenerEstadoDirectoEdicion(id) {
  return estadosEdiciones[id] || 'me-falta';
}

function obtenerEstadoDirectoPresentacion(id) {
  return estadosPresentaciones[id] || 'me-falta';
}

function guardarEstadoEdicion(id, estado) {
  estadosEdiciones[id] = estado;
  guardarEstados(STORAGE_EDICIONES, estadosEdiciones);
}

function guardarEstadoPresentacion(id, estado) {
  estadosPresentaciones[id] = estado;
  guardarEstados(STORAGE_PRESENTACIONES, estadosPresentaciones);
}

function obtenerModeloParaEdicion(edicion) {
  return modelos.find(modelo => modelo.id === edicion.modeloId) || { nombre: 'Desconocido', pelicula: '' };
}

function presentacionesParaEdicion(edicion) {
  return presentaciones.filter(p => p.contenido.includes(edicion.id));
}

// Helper: try a list of image URLs and set as background when one loads
function setBackgroundFromCandidates(el, list, fallbackText = '') {
  const candidates = (list || []).filter(Boolean);
  function tryIdx(idx) {
    if (idx >= candidates.length) {
      el.textContent = fallbackText;
      return;
    }
    const src = candidates[idx];
    const img = new Image();
    img.onload = () => {
      el.textContent = '';
      el.style.backgroundImage = `url('${src}')`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
      el.style.minHeight = '84px';
    };
    img.onerror = () => tryIdx(idx + 1);
    img.src = src;
  }
  tryIdx(0);
}

function presentacionesLoTengoParaEdicion(edicion) {
  return presentacionesParaEdicion(edicion).filter(p => obtenerEstadoDirectoPresentacion(p.id) === 'lo-tengo');
}

function calcularEstadoEfectivoEdicion(edicion) {
  const estadoDirecto = obtenerEstadoDirectoEdicion(edicion.id);
  const tienePresentacion = presentacionesLoTengoParaEdicion(edicion).length > 0;
  return estadoDirecto === 'lo-tengo' || tienePresentacion ? 'lo-tengo' : estadoDirecto;
}

function obtenerTextoObtenidoMediante(edicion) {
  const estadoDirecto = obtenerEstadoDirectoEdicion(edicion.id);
  if (estadoDirecto === 'lo-tengo') {
    return '';
  }

  const presentaciones = presentacionesLoTengoParaEdicion(edicion);
  if (!presentaciones.length) {
    return '';
  }

  return `Obtenido mediante: ${presentaciones.map(item => item.nombre).join(', ')}`;
}

function buscarEdiciones() {
  const termino = terminoBusqueda.trim().toLowerCase();

  return ediciones.filter(edicion => {
    const modelo = obtenerModeloParaEdicion(edicion);
    const texto = `${modelo.nombre} ${edicion.variante}`.toLowerCase();
    const coincideBusqueda = texto.includes(termino);
    const estadoEfectivo = calcularEstadoEfectivoEdicion(edicion);
    const coincideFiltro = estadoFiltroSeleccionado === 'todos' || estadoEfectivo === estadoFiltroSeleccionado;
    return coincideBusqueda && coincideFiltro;
  });
}

function actualizarResumen() {
  const total = ediciones.length;
  const conteo = {
    'lo-tengo': 0,
    'lo-busco': 0,
    'me-falta': 0
  };

  ediciones.forEach(edicion => {
    const estado = calcularEstadoEfectivoEdicion(edicion);
    conteo[estado] += 1;
  });

  const completado = total ? Math.round((conteo['lo-tengo'] / total) * 100) : 0;

  elementos.totalAutitos.textContent = total;
  elementos.tengoAutitos.textContent = conteo['lo-tengo'];
  elementos.buscoAutitos.textContent = conteo['lo-busco'];
  elementos.faltaAutitos.textContent = conteo['me-falta'];
  elementos.porcentajeCompletado.textContent = `${completado}%`;
}

function limpiarCatalogo() {
  elementos.catalogo.innerHTML = '';
}

function crearBotonEstado(texto, estadoBoton, estadoActual, callback) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'boton-estado';
  boton.dataset.estado = estadoBoton;
  boton.textContent = texto;

  if (estadoBoton === estadoActual) {
    boton.classList.add('activo');
  }

  boton.addEventListener('click', callback);
  return boton;
}

function crearTarjetaPresentacion(presentacion) {
  const estadoDirecto = obtenerEstadoDirectoPresentacion(presentacion.id);
  const tarjeta = document.createElement('article');
  tarjeta.className = 'presentacion';

  // imagen de la presentación (thumbnail)
  const imagen = document.createElement('div');
  imagen.className = 'presentacion-imagen';
  imagen.setAttribute('aria-label', `${presentacion.nombre} imagen`);
  // build candidates: explicit imagen, its basename in year folder and top-level
  const presCandidates = [];
  if (presentacion.imagen) {
    presCandidates.push(presentacion.imagen);
    const base = String(presentacion.imagen).split('/').pop().toLowerCase();
    if (base) {
      if (presentacion.año) presCandidates.push(`images/${presentacion.año}/${base}`);
      presCandidates.push(`images/${base}`);
    }
  }
  // do NOT derive candidate filenames from the presentation name;
  // only use explicit `presentacion.imagen` (and its basename variants)
  setBackgroundFromCandidates(imagen, presCandidates, presentacion.nombre);

  // create a body wrapper for text content so the image can sit to the right
  const body = document.createElement('div');
  body.className = 'presentacion-body';

  const titulo = document.createElement('h3');
  titulo.textContent = presentacion.nombre;

  const meta = document.createElement('div');
  meta.className = 'presentacion-meta';

  ['tipo', 'año'].forEach(prop => {
    const parrafo = document.createElement('p');
    parrafo.innerHTML = `<strong>${prop === 'tipo' ? 'Tipo' : 'Año'}:</strong> ${presentacion[prop]}`;
    meta.appendChild(parrafo);
  });

  const personajes = document.createElement('div');
  personajes.className = 'presentacion-personajes';
  presentacion.contenido.forEach(idEdicion => {
    const edicion = ediciones.find(item => item.id === idEdicion);
    if (!edicion) {
      return;
    }
    const modelo = obtenerModeloParaEdicion(edicion);
    const chip = document.createElement('span');
    chip.className = 'personaje-chip';
    chip.textContent = `${modelo.nombre}`;
    personajes.appendChild(chip);
  });

  const estadoTarjeta = document.createElement('div');
  estadoTarjeta.className = 'presentacion-estado';

  const etiquetaEstado = document.createElement('span');
  etiquetaEstado.className = `estado-badge estado-${estadoDirecto}`;
  etiquetaEstado.textContent = `Presentación: ${estadoEtiqueta[estadoDirecto]}`;
  estadoTarjeta.appendChild(etiquetaEstado);

  const botonera = document.createElement('div');
  botonera.className = 'botones-estado';

  ['lo-tengo', 'lo-busco', 'me-falta'].forEach(estado => {
    botonera.appendChild(
      crearBotonEstado(estadoEtiqueta[estado], estado, estadoDirecto, () => {
        guardarEstadoPresentacion(presentacion.id, estado);
        renderizarCatalogo();
      })
    );
  });

  body.appendChild(titulo);
  body.appendChild(meta);
  body.appendChild(personajes);
  body.appendChild(estadoTarjeta);
  body.appendChild(botonera);

  tarjeta.appendChild(body);
  tarjeta.appendChild(imagen);

  return tarjeta;
}

function crearTarjetaEdicion(edicion) {
  const modelo = obtenerModeloParaEdicion(edicion);
  const estadoDirecto = obtenerEstadoDirectoEdicion(edicion.id);
  const estadoEfectivo = calcularEstadoEfectivoEdicion(edicion);
  const obtenidoMediante = obtenerTextoObtenidoMediante(edicion);

  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta';

  const encabezado = document.createElement('div');
  encabezado.className = 'tarjeta-encabezado';

  const imagen = document.createElement('div');
  imagen.className = 'tarjeta-imagen';
  const urlImagen = typeof edicion.imagen === 'string'
    ? edicion.imagen
    : edicion.imagen?.src || '';

  imagen.textContent = urlImagen ? '' : modelo.nombre;
  // Try multiple candidate paths so images can live in year folders (e.g. images/2006/...)
  const candidates = [];
  if (typeof edicion.imagen === 'string' && edicion.imagen) {
    candidates.push(edicion.imagen);
    // also try the bare filename inside the year folder and top-level images/
    const base = edicion.imagen.split('/').pop().toLowerCase();
    if (base) {
      if (edicion.anio) {
        candidates.push(`images/${edicion.anio}/${base}`);
      }
      candidates.push(`images/${base}`);
    }
  }

  // If the edicion itself has no image, try images from its presentaciones
  const presRelacionadas = presentacionesParaEdicion(edicion);
  presRelacionadas.forEach(p => {
    if (p.imagen) {
      candidates.push(p.imagen);
      const baseP = String(p.imagen).split('/').pop().toLowerCase();
      if (baseP) {
        if (p.año) {
          candidates.push(`images/${p.año}/${baseP}`);
        }
        candidates.push(`images/${baseP}`);
      }
    }
  });

  const modeloIdFile = edicion.modeloId ? String(edicion.modeloId).toLowerCase() : '';
  const modeloSlug = modelo.nombre ? String(modelo.nombre).toLowerCase().replace(/[^a-z0-9]+/g, '') : modeloIdFile;
  const modeloDash = modelo.nombre ? String(modelo.nombre).toLowerCase().replace(/[^a-z0-9]+/g, '-') : modeloIdFile;

  if (edicion.anio) {
    candidates.push(`images/${edicion.anio}/${modeloIdFile}.png`);
    candidates.push(`images/${edicion.anio}/${modeloSlug}.png`);
    candidates.push(`images/${edicion.anio}/${modeloDash}.png`);
  }

  // Do not automatically fall back to generic model filenames here
  // (images/<modelo>.png) because that causes the same image to appear
  // for every edition of the model. If you prefer a model-level image,
  // add it explicitly to the `edicion.imagen` or to the presentation.

  // helper: try each src until one loads, otherwise show the model name
  function trySetBackground(list, el, idx = 0) {
    if (idx >= list.length) {
      el.textContent = modelo.nombre || '';
      return;
    }
    const src = list[idx];
    const test = new Image();
    test.onload = () => {
      el.textContent = '';
      el.style.backgroundImage = `url('${src}')`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
    };
    test.onerror = () => trySetBackground(list, el, idx + 1);
    test.src = src;
  }

  trySetBackground(candidates.filter(Boolean), imagen);
  imagen.setAttribute('aria-label', `${modelo.nombre} imagen`);

  const info = document.createElement('div');
  info.className = 'tarjeta-info';

  const titulo = document.createElement('h2');
  titulo.textContent = modelo.nombre;

  const descripcion = document.createElement('p');
  descripcion.textContent = `${edicion.variante ? edicion.variante + ' · ' : ''}${modelo.pelicula}`;

  const estadoBadge = document.createElement('span');
  estadoBadge.className = `estado-badge estado-${estadoEfectivo}`;
  estadoBadge.textContent = estadoEtiqueta[estadoEfectivo];

  info.appendChild(titulo);
  info.appendChild(descripcion);
  info.appendChild(estadoBadge);

  encabezado.appendChild(imagen);
  encabezado.appendChild(info);

  const detalles = document.createElement('div');
  detalles.className = 'detalles-tarjeta';

  const propiedades = document.createElement('div');
  propiedades.className = 'propiedades';

  const propPelicula = document.createElement('div');
  propPelicula.className = 'propiedad';
  propPelicula.innerHTML = '<span>Película</span><strong>' + modelo.pelicula + '</strong>';

  const propPais = document.createElement('div');
  propPais.className = 'propiedad';
  propPais.innerHTML = '<span>País</span><strong>' + edicion.pais + '</strong>';

  const propAnio = document.createElement('div');
  propAnio.className = 'propiedad';
  propAnio.innerHTML = '<span>Año</span><strong>' + edicion.anio + '</strong>';

  const propPresentaciones = document.createElement('div');
  propPresentaciones.className = 'propiedad';
  propPresentaciones.innerHTML = '<span>Presentaciones</span><strong>' + presentacionesParaEdicion(edicion).length + '</strong>';

  propiedades.appendChild(propPelicula);
  propiedades.appendChild(propPais);
  propiedades.appendChild(propAnio);
  propiedades.appendChild(propPresentaciones);

  // move propiedades into the encabezado so they appear at the right of the header
  encabezado.appendChild(propiedades);

  const botonera = document.createElement('div');
  botonera.className = 'botones-estado';

  ['lo-tengo', 'lo-busco', 'me-falta'].forEach(estado => {
    botonera.appendChild(
      crearBotonEstado(estadoEtiqueta[estado], estado, estadoDirecto, () => {
        guardarEstadoEdicion(edicion.id, estado);
        renderizarCatalogo();
      })
    );
  });

  const acciones = document.createElement('div');
  acciones.className = 'boton-acciones';

  acciones.appendChild(botonera);

  const btnVer = document.createElement('button');
  btnVer.type = 'button';
  btnVer.className = 'boton boton-ver';
  btnVer.innerHTML = '<span>Ver presentaciones</span>';

  const panelPresentaciones = document.createElement('div');
  panelPresentaciones.className = 'presentaciones hidden';

  btnVer.addEventListener('click', () => {
    panelPresentaciones.classList.toggle('hidden');
    btnVer.innerHTML = panelPresentaciones.classList.contains('hidden')
      ? '<span>Ver presentaciones</span>'
      : '<span>Ocultar presentaciones</span>';
  });

  acciones.appendChild(btnVer);

  detalles.appendChild(acciones);

  if (obtenidoMediante) {
    const texto = document.createElement('p');
    texto.className = 'texto-obtenido';
    texto.textContent = obtenidoMediante;
    detalles.appendChild(texto);
  }

  const presentacionesRelacionadas = presentacionesParaEdicion(edicion);
  presentacionesRelacionadas.forEach(presentacion => {
    panelPresentaciones.appendChild(crearTarjetaPresentacion(presentacion));
  });

  tarjeta.appendChild(encabezado);
  tarjeta.appendChild(detalles);
  tarjeta.appendChild(panelPresentaciones);

  return tarjeta;
}

function renderizarCatalogo() {
  limpiarCatalogo();
  actualizarResumen();

  const resultados = buscarEdiciones();

  if (!resultados.length) {
    elementos.mensajeNoResultados.classList.remove('hidden');
    return;
  }

  elementos.mensajeNoResultados.classList.add('hidden');
  resultados.forEach(edicion => {
    elementos.catalogo.appendChild(crearTarjetaEdicion(edicion));
  });
}

function reiniciarChecklist() {
  const confirmacion = confirm('¿Estás seguro de que deseas reiniciar tu checklist? Se borrarán los estados guardados.');
  if (!confirmacion) {
    return;
  }

  estadosEdiciones = {};
  estadosPresentaciones = {};
  guardarEstados(STORAGE_EDICIONES, estadosEdiciones);
  guardarEstados(STORAGE_PRESENTACIONES, estadosPresentaciones);
  terminoBusqueda = '';
  estadoFiltroSeleccionado = 'todos';
  elementos.busqueda.value = '';
  elementos.filtroEstado.value = 'todos';
  renderizarCatalogo();
}

function configurarEventos() {
  elementos.busqueda.addEventListener('input', event => {
    terminoBusqueda = event.target.value;
    renderizarCatalogo();
  });

  elementos.filtroEstado.addEventListener('change', event => {
    estadoFiltroSeleccionado = event.target.value;
    renderizarCatalogo();
  });

  if (elementos.filtroAnio) {
    elementos.filtroAnio.addEventListener('change', event => {
      const value = event.target.value;
      renderPresentacionesPorAnio(value);
    });
  }

  elementos.menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const viewId = tab.dataset.view;
      mostrarVista(viewId);
    });
  });

  elementos.btnReiniciar.addEventListener('click', reiniciarChecklist);
}

function mostrarVista(viewId) {
  elementos.views.forEach(view => {
    view.classList.toggle('hidden', view.id !== viewId);
  });

  elementos.menuTabs.forEach(tab => {
    tab.classList.toggle('activo', tab.dataset.view === viewId);
  });

  if (viewId === 'search-cars') {
    renderizarCatalogo();
  }
}

function iniciarAplicacion() {
  configurarEventos();
  renderizarCatalogo();
  mostrarVista('home');
}

iniciarAplicacion();

// --- Presentaciones por año ---
function añosDisponibles() {
  const años = Array.from(new Set(presentaciones.map(p => p.año))).sort((a, b) => a - b);
  return años;
}

function popularFiltroAnio() {
  if (!elementos.filtroAnio) return;
  const años = añosDisponibles();
  años.forEach(a => {
    const opt = document.createElement('option');
    opt.value = String(a);
    opt.textContent = String(a);
    elementos.filtroAnio.appendChild(opt);
  });
}

function renderPresentacionesPorAnio(value) {
  // value: 'todos' or year string
  elementos.presentacionesPorAnioContenido.innerHTML = '';

  if (value === 'todos') {
    return;
  }

  const año = Number(value);
  const lista = presentaciones.filter(p => p.año === año);
  if (!lista.length) {
    elementos.presentacionesPorAnioContenido.innerHTML = '<p class="texto-empty">No hay presentaciones para ese año.</p>';
    return;
  }

  // order types: individual (autos) first, then Pack de 2, Multipack, Playset, DVD, others
  const ordenTipos = ['Blister Individual', 'Pack de 2', 'Multipack', 'Playset', 'DVD'];

  const grouped = {};
  lista.forEach(p => {
    const key = p.tipo || 'Otros';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  });

  const contenedor = document.createElement('section');
  contenedor.id = 'presentaciones-por-anio';
  contenedor.className = 'presentaciones-por-anio';
  const titulo = document.createElement('h2');
  titulo.textContent = `Presentaciones ${año}`;
  contenedor.appendChild(titulo);

  // first, render items from ordenTipos in that order
  ordenTipos.forEach(tipo => {
    if (!grouped[tipo]) return;
    const grupoEl = document.createElement('div');
    grupoEl.className = 'grupo-presentaciones';
    const encabezado = document.createElement('h3');
    encabezado.textContent = tipo;
    grupoEl.appendChild(encabezado);

    grouped[tipo].forEach(item => {
      const tarjeta = document.createElement('article');
      tarjeta.className = 'tarjeta presentacion-mini';

      const contenido = document.createElement('div');
      contenido.className = 'presentacion-mini-contenido';

      const tituloStrong = document.createElement('strong');
      tituloStrong.textContent = item.nombre;
      contenido.appendChild(tituloStrong);

      if (item.productCode) {
        const pc = document.createElement('div');
        pc.className = 'presentacion-mini-meta';
        pc.textContent = `Código de producto: ${item.productCode}`;
        contenido.appendChild(pc);
      }
      if (item.precioEstimado) {
        const pr = document.createElement('div');
        pr.className = 'presentacion-mini-meta';
        pr.textContent = `Precio estimado: ${item.precioEstimado}`;
        contenido.appendChild(pr);
      }

      // image on the right (only if presentacion.imagen is defined)
      const imgDiv = document.createElement('div');
      imgDiv.className = 'presentacion-mini-imagen';
      if (item.imagen) {
        const base = String(item.imagen).split('/').pop().toLowerCase();
        const candidates = [item.imagen];
        if (base) {
          if (item.año) candidates.push(`images/${item.año}/${base}`);
          candidates.push(`images/${base}`);
        }
        setBackgroundFromCandidates(imgDiv, candidates, '');
      } else {
        // mark as no-image so CSS can collapse the box
        imgDiv.classList.add('no-image');
      }

      tarjeta.appendChild(contenido);
      tarjeta.appendChild(imgDiv);
      grupoEl.appendChild(tarjeta);
    });

    contenedor.appendChild(grupoEl);
  });

  // render any remaining tipos not in ordenTipos
  Object.keys(grouped).forEach(tipo => {
    if (ordenTipos.includes(tipo)) return;
    const grupoEl = document.createElement('div');
    grupoEl.className = 'grupo-presentaciones';
    const encabezado = document.createElement('h3');
    encabezado.textContent = tipo;
    grupoEl.appendChild(encabezado);

    grouped[tipo].forEach(item => {
      const tarjeta = document.createElement('article');
      tarjeta.className = 'tarjeta presentacion-mini';

      const contenido = document.createElement('div');
      contenido.className = 'presentacion-mini-contenido';

      const tituloStrong = document.createElement('strong');
      tituloStrong.textContent = item.nombre;
      contenido.appendChild(tituloStrong);

      if (item.productCode) {
        const pc = document.createElement('div');
        pc.className = 'presentacion-mini-meta';
        pc.textContent = `Código de producto: ${item.productCode}`;
        contenido.appendChild(pc);
      }
      if (item.precioEstimado) {
        const pr = document.createElement('div');
        pr.className = 'presentacion-mini-meta';
        pr.textContent = `Precio estimado: ${item.precioEstimado}`;
        contenido.appendChild(pr);
      }

      const imgDiv = document.createElement('div');
      imgDiv.className = 'presentacion-mini-imagen';
      if (item.imagen) {
        const base = String(item.imagen).split('/').pop().toLowerCase();
        const candidates = [item.imagen];
        if (base) {
          if (item.año) candidates.push(`images/${item.año}/${base}`);
          candidates.push(`images/${base}`);
        }
        setBackgroundFromCandidates(imgDiv, candidates, '');
      } else {
        imgDiv.classList.add('no-image');
      }

      tarjeta.appendChild(contenido);
      tarjeta.appendChild(imgDiv);
      grupoEl.appendChild(tarjeta);
    });

    contenedor.appendChild(grupoEl);
  });

  elementos.presentacionesPorAnioContenido.appendChild(contenedor);

  // Cleanup: hide any meta labels that were created without values
  // (covers stale/old markup or cached content)
  const metas = elementos.presentacionesPorAnioContenido.querySelectorAll('.presentacion-mini-meta');
  metas.forEach(m => {
    const txt = (m.textContent || '').trim();
    // hide if there's a colon but nothing after it (robust for stray whitespace)
    const parts = txt.split(':');
    if (parts.length > 1 && parts.slice(1).join(':').trim().length === 0) {
      m.style.display = 'none';
    }
  });
}

// populate año filter on load
popularFiltroAnio();
