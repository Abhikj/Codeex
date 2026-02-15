const inventory = [
  { id: crypto.randomUUID(), name: "Pilsner Malt", category: "Malt", quantity: 180, unit: "kg", threshold: 60 },
  { id: crypto.randomUUID(), name: "Cascade Hops", category: "Hops", quantity: 25, unit: "kg", threshold: 20 },
  { id: crypto.randomUUID(), name: "Ale Yeast US-05", category: "Yeast", quantity: 14, unit: "packets", threshold: 8 }
];

const batches = [];

const inventoryForm = document.getElementById("inventory-form");
const batchForm = document.getElementById("batch-form");
const inventoryTableBody = document.getElementById("inventory-table-body");
const batchTableBody = document.getElementById("batch-table-body");
const batchIngredientSelect = document.getElementById("batch-ingredient");

function formatStock(item) {
  return `${item.quantity.toFixed(2)} ${item.unit}`;
}

function getStockStatus(item) {
  return item.quantity <= item.threshold ? "LOW" : "OK";
}

function renderInventory() {
  inventoryTableBody.innerHTML = "";
  inventory.forEach((item) => {
    const row = document.createElement("tr");
    const status = getStockStatus(item);
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${formatStock(item)}</td>
      <td>${item.threshold.toFixed(2)} ${item.unit}</td>
      <td class="${status === "LOW" ? "status-low" : "status-good"}">${status}</td>
    `;
    inventoryTableBody.appendChild(row);
  });
}

function renderBatchOptions() {
  batchIngredientSelect.innerHTML = "";
  inventory.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} (${item.quantity.toFixed(2)} ${item.unit})`;
    batchIngredientSelect.appendChild(option);
  });
}

function renderBatches() {
  batchTableBody.innerHTML = "";
  batches.forEach((batch) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${batch.name}</td>
      <td>${batch.volume} L</td>
      <td>${batch.date}</td>
      <td>${batch.ingredientName}</td>
      <td>${batch.amountUsed.toFixed(2)} ${batch.unit}</td>
    `;
    batchTableBody.appendChild(row);
  });
}

inventoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const item = {
    id: crypto.randomUUID(),
    name: document.getElementById("ingredient-name").value.trim(),
    category: document.getElementById("ingredient-category").value,
    quantity: Number(document.getElementById("ingredient-quantity").value),
    unit: document.getElementById("ingredient-unit").value,
    threshold: Number(document.getElementById("ingredient-threshold").value)
  };

  inventory.push(item);
  inventoryForm.reset();
  renderInventory();
  renderBatchOptions();
});

batchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ingredientId = batchIngredientSelect.value;
  const amountUsed = Number(document.getElementById("batch-amount").value);
  const ingredient = inventory.find((item) => item.id === ingredientId);

  if (!ingredient) {
    return;
  }

  ingredient.quantity = Math.max(0, ingredient.quantity - amountUsed);

  batches.unshift({
    name: document.getElementById("batch-name").value.trim(),
    volume: Number(document.getElementById("batch-volume").value),
    date: document.getElementById("batch-date").value,
    ingredientName: ingredient.name,
    amountUsed,
    unit: ingredient.unit
  });

  batchForm.reset();
  renderInventory();
  renderBatchOptions();
  renderBatches();
});

renderInventory();
renderBatchOptions();
renderBatches();
