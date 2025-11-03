'use client';

import styles from "../blogs/blogs.module.css";
import { useRouter } from "next/navigation";

export default function DetalleBlog1() {
  const router = useRouter();
  return (
    <div style={{ marginTop: 40 }}>
      <h1 className={styles.encabezado1}>BLOG 1</h1>
      <section className={styles["blog-card"]}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className={styles.texto1} style={{ color: '#fff', fontSize: '2rem', marginBottom: 18, textAlign: 'center' }}>
            Nuevo Curso de Machine Learning
          </h1>
          <img src="/curso.jpg" alt="Logo" className={styles.imagen1} style={{ marginBottom: 24 }} />
          <p className={styles.texto2} style={{ color: '#fff', fontSize: '1.15rem', textAlign: 'center', marginBottom: 24 }}>
            El 18 de septiembre se estrenara un nuevo curso para la plataforma, en esta oportunidad te entregamos todo el conocimiento sobre el Machine Learning y la IA.<br /><br />
            Este curso enseñara un poco de la historia de la IA, sus aplicaciones y como se esta utilizando en la actualidad, ademas de los conceptos basicos y avanzados de Machine Learning, para que puedas entender como funcionan los algoritmos y aplicarlos a traves de ejercicios en un sandbox que ofrecemos en la plataforma del curso.<br /><br />
            No te pierdas esta oportunidad unica de aprender sobre una de las tecnologias mas importantes de la actualidad y el futuro, inscríbete ya en nuestro nuevo curso de Machine Learning, es totalmente gratuito.
          </p>
          <button className={styles.boton1} onClick={() => router.push('/blogs')}>Volver</button>
        </div>
      </section>
    </div>
  );
}
