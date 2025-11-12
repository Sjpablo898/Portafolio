console.log("Sitio de Fútbol Total cargado correctamente");

window.onload = () => {
    alert("¡Bienvenido a Fútbol Total!");
};

document.addEventListener("DOMContentLoaded", () => {
    const botonArriba = document.getElementById("btnArriba");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            botonArriba.style.display = "block";
        } else {
            botonArriba.style.display = "none";
        }
    });

    botonArriba.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
