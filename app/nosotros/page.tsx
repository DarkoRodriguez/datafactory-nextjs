"use client";

import "../../styles/nosotros.css";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Nosotros() {
  return (
    <main>

      {/* Sección Nosotros */}
      <section className="nosotros-section">
        <div className="nosotros-col izq">
          <h2>¿Quiénes somos?</h2>
          <p style={{ textAlign: "justify" }}>
            En Data Factory somos un equipo apasionado por la tecnología y la educación, dedicado a acercar el mundo de la programación a todas las personas. Nos especializamos en la venta de libros y cursos de programación cuidadosamente seleccionados, pensados tanto para quienes dan sus primeros pasos como para quienes buscan perfeccionar sus habilidades.
          </p>
        </div>

        <div className="nosotros-col der">
          <h2>Nuestra Historia</h2>
          <p style={{ textAlign: "justify" }}>
            Data Factory nació del sueño de un grupo de entusiastas de la tecnología que, al notar la falta de recursos accesibles y de calidad para aprender programación, decidieron crear una plataforma dedicada a la educación digital. Comenzamos como una pequeña librería especializada en libros de informática, pero pronto nos dimos cuenta de la necesidad de ofrecer también cursos prácticos y actualizados para acompañar a nuestros clientes en su camino de aprendizaje.
          </p>
          <p style={{ textAlign: "justify" }}>
            A lo largo de los años, hemos crecido junto a una comunidad de estudiantes, profesionales y autodidactas que confían en nosotros para potenciar sus habilidades. Nuestro compromiso es seguir innovando y acercando el conocimiento a todas las personas, porque creemos que la programación es una herramienta poderosa para transformar vidas y abrir nuevas oportunidades en el mundo digital.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer2">
        <p>&copy; 2024 Data Factory. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
