"use strict";

const copyButtons = document.querySelectorAll(".copy-link");
const copyToast = document.getElementById("copyToast");

let toastTimeout;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const fallback = document.createElement("textarea");

    fallback.value = text;
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";

    document.body.appendChild(fallback);
    fallback.select();

    const copied = document.execCommand("copy");

    fallback.remove();

    return copied;
  }
}

function showToast(message) {
  copyToast.textContent = message;
  copyToast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    copyToast.classList.remove("show");
  }, 2200);
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const url = button.dataset.copy;

    const copied = await copyText(url);

    showToast(copied ? "הקישור הועתק" : "לא ניתן היה להעתיק");
  });
});