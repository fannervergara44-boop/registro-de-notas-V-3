// ============================================================
// 🔥 CONEXIÓN A FIREBASE (Configuración personalizada)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración del proyecto Firebase (la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyD9N625_qUokqdaR_kUVZhT3LoVc79A1Ts",
  authDomain: "notas-d7b9c.firebaseapp.com",
  projectId: "notas-d7b9c",
  storageBucket: "notas-d7b9c.firebasestorage.app",
  messagingSenderId: "815120496065",
  appId: "1:815120496065:web:8117484ea407794c306b40"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// 📋 MANEJO DE FORMULARIO Y LISTADO
// ============================================================

const form = document.getElementById("nota-form");
const listaNotas = document.getElementById("lista-notas");
const totalNotas = document.getElementById("total-notas");
const notasAprobadas = document.getElementById("notas-aprobadas");
const notasPerdidas = document.getElementById("notas-perdidas");
const limpiarBtn = document.getElementById("limpiar-btn");

// Guardar nota en Firestore
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const documento = document.getElementById("documento").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const nota = parseFloat(document.getElementById("nota").value);

  if (!documento || !nombre || isNaN(nota)) {
    alert("⚠️ Por favor completa todos los campos antes de guardar.");
    return;
  }

  try {
    await addDoc(collection(db, "notas"), {
      documento,
      nombre,
      nota,
      fecha: new Date()
    });
    alert("✅ Nota guardada correctamente en Firebase.");
    form.reset();
    cargarNotas();
  } catch (error) {
    console.error("❌ Error al guardar en Firebase:", error);
    alert("Error al guardar la nota. Revisa la consola.");
  }
});

// ============================================================
// 📤 CARGAR NOTAS DESDE FIREBASE
// ============================================================
async function cargarNotas() {
  listaNotas.innerHTML = "<li>Cargando notas...</li>";
  try {
    const querySnapshot = await getDocs(collection(db, "notas"));
    listaNotas.innerHTML = "";

    let total = 0, aprobadas = 0, perdidas = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      total++;
      if (data.nota >= 3.0) aprobadas++;
      else perdidas++;

      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${data.nombre}</strong> (${data.documento})<br>
          Nota: <strong>${data.nota}</strong>
        </div>
        <button class="borrar-btn" data-id="${docSnap.id}" title="Eliminar nota">🗑️</button>
      `;
      listaNotas.appendChild(li);
    });

    totalNotas.textContent = total;
    notasAprobadas.textContent = aprobadas;
    notasPerdidas.textContent = perdidas;

    if (total === 0) {
      listaNotas.innerHTML = "<li>No hay notas registradas.</li>";
    }
  } catch (error) {
    console.error("❌ Error al cargar notas:", error);
  }
}

// ============================================================
// 🗑️ ELIMINAR NOTA
// ============================================================
listaNotas.addEventListener("click", async (e) => {
  if (e.target.classList.contains("borrar-btn")) {
    const id = e.target.getAttribute("data-id");
    if (confirm("¿Deseas eliminar esta nota?")) {
      try {
        await deleteDoc(doc(db, "notas", id));
        alert("🗑️ Nota eliminada correctamente.");
        cargarNotas();
      } catch (error) {
        console.error("Error al eliminar nota:", error);
      }
    }
  }
});

// ============================================================
// 🧹 LIMPIAR FORMULARIO
// ============================================================
limpiarBtn.addEventListener("click", () => form.reset());

// ============================================================
// 🚀 INICIAR
// ============================================================
window.addEventListener("load", cargarNotas);
