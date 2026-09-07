// ── CAMPO DE INVITADOS: validación estricta ──
const guestsInput = document.getElementById('f-guests');

// 1. CORREGIR MIENTRAS SE ESCRIBE (solo números, máx 4, mín 1)
guestsInput.addEventListener('input', function() {
  // Remover cualquier caracter no numérico
  this.value = this.value.replace(/\D/g, '');
  
  // Si está vacío, no hacer nada (pero al perder foco se pondrá 1)
  if (this.value === '') return;
  
  let val = parseInt(this.value);
  
  if (val > 4) {
    this.value = 4;
  } else if (val < 1) {
    // No corregimos a 1 aquí para permitir borrar todo, pero sí al perder foco
    // Si el usuario escribe 0, lo dejamos temporalmente (se corregirá en blur)
    if (val === 0) {
      this.value = '';
    }
  }
});

// 2. CORREGIR AL PERDER EL FOCO (blur)
guestsInput.addEventListener('blur', function() {
  // Si está vacío o no es número, poner 1
  if (this.value === '' || isNaN(parseInt(this.value))) {
    this.value = 1;
    return;
  }
  let val = parseInt(this.value);
  if (val > 4) {
    this.value = 4;
  } else if (val < 1) {
    this.value = 1;
  }
});

// 3. BLOQUEAR TECLAS NO NUMÉRICAS (incluyendo puntos, comas, etc.)
guestsInput.addEventListener('keydown', function(e) {
  // Permitir teclas de control: backspace, delete, tab, flechas, etc.
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (allowedKeys.includes(e.key)) return;
  
  // Permitir números (teclas numéricas y teclado numérico)
  if (e.key >= '0' && e.key <= '9') return;
  
  // Bloquear cualquier otra tecla
  e.preventDefault();
});