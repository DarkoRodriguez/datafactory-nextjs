// tests/validarNavegacion.js
const { Builder, By, until } = require('selenium-webdriver');

(async function testNavegacionBlogsLento() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1️⃣ Abrir la página de blogs
    console.log("⏳ Abriendo página 'blogs'...");
    await driver.get('http://localhost:3000/blogs');
    await driver.sleep(2000); // espera 2 segundos
    console.log("✅ Página 'blogs' abierta correctamente");

    // 2️⃣ Validar encabezado 'BLOGS'
    const tituloBlogs = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(),'BLOGS')]")),
      5000
    );
    console.log("⏳ Validando encabezado de blogs...");
    await driver.sleep(1500);
    console.log("✅ Encabezado de blogs encontrado");

    // 3️⃣ Hacer clic en el primer blog
    const botonBlog1 = await driver.wait(
      until.elementLocated(By.css('.boton1')),
      5000
    );
    console.log("⏳ Haciendo scroll al primer blog...");
    await driver.executeScript("arguments[0].scrollIntoView(true);", botonBlog1);
    await driver.sleep(1000);
    console.log("⏳ Clic en primer blog...");
    await botonBlog1.click();
    await driver.sleep(2000);

    // 4️⃣ Validar redirección a detalleBlog1
    await driver.wait(until.urlContains('/detalleBlog1'), 5000);
    const currentUrl1 = await driver.getCurrentUrl();
    console.log(`⏳ Verificando URL: ${currentUrl1}`);
    if (currentUrl1.includes('/detalleBlog1')) {
      console.log("✅ Redirección a 'detalleBlog1' correcta");
    } else {
      console.error("❌ Error en redirección a 'detalleBlog1'");
    }

    // 5️⃣ Validar encabezado detalleBlog1
    const tituloBlog1 = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(),'BLOG 1')]")),
      5000
    );
    await driver.sleep(1500);
    console.log("✅ Página 'detalleBlog1' cargada correctamente");

    // 6️⃣ Volver a blogs
    const botonVolver1 = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Volver')]")),
      5000
    );
    console.log("⏳ Volviendo a 'blogs'...");
    await driver.executeScript("arguments[0].scrollIntoView(true);", botonVolver1);
    await driver.sleep(1000);
    await botonVolver1.click();
    await driver.wait(until.urlContains('/blogs'), 5000);
    await driver.sleep(2000);
    console.log("✅ Redirección de vuelta a 'blogs' correcta");

    // 7️⃣ Hacer clic en el segundo blog
    const botonBlog2 = await driver.wait(
      until.elementLocated(By.css('.boton2')),
      5000
    );
    console.log("⏳ Haciendo scroll al segundo blog...");
    await driver.executeScript("arguments[0].scrollIntoView(true);", botonBlog2);
    await driver.sleep(1000);
    console.log("⏳ Clic en segundo blog...");
    await botonBlog2.click();
    await driver.sleep(2000);

    // 8️⃣ Validar redirección a detalleBlog2
    await driver.wait(until.urlContains('/detalleBlog2'), 5000);
    const currentUrl2 = await driver.getCurrentUrl();
    console.log(`⏳ Verificando URL: ${currentUrl2}`);
    if (currentUrl2.includes('/detalleBlog2')) {
      console.log("✅ Redirección a 'detalleBlog2' correcta");
    } else {
      console.error("❌ Error en redirección a 'detalleBlog2'");
    }

    // 9️⃣ Validar encabezado detalleBlog2
    const tituloBlog2 = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(),'BLOG 2')]")),
      5000
    );
    await driver.sleep(1500);
    console.log("✅ Página 'detalleBlog2' cargada correctamente");

    // 🔟 Volver a blogs desde detalleBlog2
    const botonVolver2 = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Volver')]")),
      5000
    );
    console.log("⏳ Volviendo a 'blogs' desde detalleBlog2...");
    await driver.executeScript("arguments[0].scrollIntoView(true);", botonVolver2);
    await driver.sleep(1000);
    await botonVolver2.click();
    await driver.wait(until.urlContains('/blogs'), 5000);
    await driver.sleep(2000);
    console.log("✅ Redirección final a 'blogs' correcta");

    console.log("🎉 Prueba completa");

  } catch (error) {
    console.error("⚠️ Error durante la prueba:", error);
  } finally {
    await driver.quit();
  }
})();
