const baseUrl = "http://127.0.0.1:8090/api/collections/contacts/records";
let contacts = [];

// Carica tutti i contatti
async function loadContacts() {
  const res = await fetch(baseUrl);
  const data = await res.json();
  contacts = data.items;
  renderList(contacts);
}

// Mostra i contatti
function renderList(list) {
  let html = "";
  list.forEach(c => {
    const date = c.appointment
      ? new Date(c.appointment).toLocaleString()
      : "Nessun appuntamento";

    html += `
      <p>
        <b>${c.name}</b> - ${c.phone} (${c.type || "?"})<br>
        <b>Appuntamento:</b> ${date}<br>

        <button onclick="editContact('${c.id}')">modifica</button>
        <button onclick="deleteContact('${c.id}')">elimina</button>
      </p>
    `;
  });

  document.getElementById("list").innerHTML = html;
}

// Aggiunge un contatto
async function addContact() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const type = document.getElementById("type").value;
  const appointmentRaw = document.getElementById("appointment").value;

  // Converte il valore datetime-local nel formato richiesto da PocketBase
  const appointment = appointmentRaw
    ? new Date(appointmentRaw).toISOString()
    : null;

  await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, type, appointment })
  });

  loadContacts();
}

// Elimina contatto
async function deleteContact(id) {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE"
  });
  loadContacts();
}

// Modifica contatto
async function editContact(id) {
  const contact = contacts.find(c => c.id === id);

  const newName = prompt("Nuovo nome:", contact.name);
  const newPhone = prompt("Nuovo telefono:", contact.phone);
  const newType = prompt("Tipo (cellulare/fisso):", contact.type);

  const newAppointmentRaw = prompt(
    "Nuova data appuntamento (YYYY-MM-DD HH:MM):",
    contact.appointment ? contact.appointment.replace("Z","") : ""
  );

  const finalAppointment = newAppointmentRaw
    ? new Date(newAppointmentRaw).toISOString()
    : null;

  await fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newName,
      phone: newPhone,
      type: newType,
      appointment: finalAppointment
    })
  });

  loadContacts();
}

document.getElementById("addBtn").addEventListener("click", addContact);

// Carica all'avvio
loadContacts();
