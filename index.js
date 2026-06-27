"use strict";

const copyButtons = document.querySelectorAll(".copy-link");
const shareButtons = document.querySelectorAll(".share-link");
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

shareButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const url = button.dataset.share;
    const title = button.dataset.title || document.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
        return;
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
      }
    }

    const copied = await copyText(url);

    showToast(copied ? "הקישור הועתק לשיתוף" : "לא ניתן היה לשתף");
  });
});
