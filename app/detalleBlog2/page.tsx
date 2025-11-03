'use client';

import styles from "../blogs/blogs.module.css";
import { useRouter } from "next/navigation";

export default function DetalleBlog2() {
  const router = useRouter();
  return (
    <div style={{ marginTop: 40 }}>
      <h1 className={styles.encabezado1}>BLOG 2</h1>
      <section className={styles["blog-card"]}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className={styles.texto1} style={{ color: '#fff', fontSize: '2rem', marginBottom: 18, textAlign: 'center' }}>
            Conferencia exclusiva por nuestro canal de youtube: ¿Como Empezar Un Proyecto Informático Desde Cero?
          </h1>
          <img src="/conferencia.jpg" alt="Logo" className={styles.imagen1} style={{ marginBottom: 24 }} />
          <p className={styles.texto2} style={{ color: '#fff', fontSize: '1.15rem', textAlign: 'center', marginBottom: 24 }}>
            El 25 de septiembre se transmitira una nueva charla por nuestro canal de youtube, se aconsejara en como abordar un proyecto Informático desde cero. Esta conferencia puede ser tu oportunidad para despejar todas tus dudas y comenzar a crear tu propio proyecto. Si eres una pyme o un emprendedor esta charla es para ti. Asistir es totalmente gratis, no te la pierdas.
          </p>
          <button className={styles.boton1} onClick={() => router.push('/blogs')}>Volver</button>
        </div>
      </section>
    </div>
  );
}
