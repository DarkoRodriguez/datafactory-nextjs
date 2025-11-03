'use client';
import styles from "./blogs.module.css";
import { useRouter } from "next/navigation";

export default function BlogsPage() {
  const router = useRouter();
  return (
    <div>
      <h1 className={styles.encabezado1}>BLOGS</h1>

      {/* Card Blog 1 */}
      <section className={styles["blog-card"]}>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 12 }}>Nuevo Curso de Machine Learning</h1>
          <p style={{ color: '#fff', fontSize: '1.1rem' }}>El 18 de septiembre se estrenara un nuevo curso para la plataforma, en esta oportunidad te entregamos todo el conocimiento sobre el Machine Learning y la IA</p>
          <button className={styles.boton1} onClick={() => router.push('/detalleBlog1')}>Ver</button>
        </div>
        <div>
          <img src="/curso.jpg" alt="Logo" className={styles.imagen1} />
        </div>
      </section>

      {/* Card Blog 2 */}
      <section className={styles["blog-card"]}>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 12 }}>Conferencia exclusiva por nuestro canal de youtube: ¿Como Empezar Un Proyecto Informático Desde Cero?</h1>
          <p style={{ color: '#fff', fontSize: '1.1rem' }}>El 25 de septiembre se transmitira una nueva charla por nuestro canal de youtube, se aconsejara en como abordar un proyecto Informático desde cero</p>
          <button className={styles.boton2} onClick={() => router.push('/detalleBlog2')}>Ver</button>
        </div>
        <div>
          <img src="/conferencia.jpg" alt="Logo" className={styles.imagen2} />
        </div>
      </section>
    </div>
  );
}
