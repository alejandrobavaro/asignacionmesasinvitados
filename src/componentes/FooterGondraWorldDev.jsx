// =========================================================
// IMPORTS
// =========================================================
import React from "react";
import "../assets/scss/_03-Componentes/_FooterGondraWorldDev.scss";

// =========================================================
// COMPONENTE FooterGondraWorldDev
// =========================================================
function FooterGondraWorldDev() {
  return (
    <div className="trademarkGondraFooter">
      <hr />

      {/* Bloque principal de texto y enlace */}
      <div className="textoFooterAutor">
        <h3>
          <a
            href="https://alejandrobavaro.github.io/gondraworld-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="texto-principal">
              <i className="bi bi-balloon-heart"></i> Inverti en Vos{" "}
              <i className="bi bi-balloon-heart"></i>
              <strong>
                <span className="texto-secundario">
                  {" "}
                  <i className="bi bi-check-circle"></i> Inverti en tus Proyectos{" "}
                  <i className="bi bi-check-circle"></i>
                </span>
              </strong>
            </h3>

            {/* Grilla de banners */}
            <div className="gridPadreProductosGondraFooter1">
              {Array.from({ length: 24 }, (_, i) => {
                const imgNumber = i < 16 ? i + 7 : i + 8; 
                return (
                  <img
                    key={imgNumber}
                    src={`/img/03-img-banners/banner${imgNumber}.png`}
                    alt={`Banner ${imgNumber}`}
                    className="imagen-limitada8 objetoCentrado1"
                  />
                );
              })}
            </div>

            <hr />

            <div className="textoFooterGondraWorld">
              <i className="bi bi-brilliance" /> - Gondra World Dev - <i className="bi bi-brilliance" />
            </div>
          </a>
        </h3>
      </div>
    </div>
  );
}

export default FooterGondraWorldDev;
