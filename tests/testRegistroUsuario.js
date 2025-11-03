const { Builder, By, until, Key } = require("selenium-webdriver");

(async function testRegistroUsuario() {
  const driver = await new Builder().forBrowser("chrome").build();

  // === Configuración de velocidad ===
  const PAUSA_GENERAL = 1200; // milisegundos entre pruebas
  const PAUSA_ESCRITURA = 100; // milisegundos entre teclas
  const PAUSA_ALERTA = 2500; // milisegundos que la alerta permanece visible antes de cerrarse

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function escribirLento(element, texto) {
    for (const char of texto) {
      await element.sendKeys(char);
      await sleep(PAUSA_ESCRITURA);
    }
  }

  async function limpiarInput(element) {
    await element.sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
    await driver.executeScript(`
      arguments[0].value = "";
      arguments[0].dispatchEvent(new Event("input", { bubbles: true }));
      arguments[0].dispatchEvent(new Event("change", { bubbles: true }));
    `, element);
    await sleep(300);
  }

  async function capturarAlert(mensajeEsperado = "") {
    try {
      await driver.wait(until.alertIsPresent(), 4000);
      const alert = await driver.switchTo().alert();
      const texto = await alert.getText();
      console.log("🔔 Alert capturado:", texto);

      await sleep(PAUSA_ALERTA);

      if (mensajeEsperado && !texto.includes(mensajeEsperado)) {
        console.warn("⚠️ El mensaje no coincide con lo esperado.");
      }

      await alert.accept();
      console.log("✅ Alerta cerrada después del tiempo de visualización.");
    } catch {
      console.warn("⚠️ No se mostró alerta en este caso.");
    }
  }

  // === Validar visibilidad de contraseñas ===
  async function validarMostrarOcultarPassword() {
    const toggleContrasena = await driver.findElement(By.css(".contraseña .form-check-input"));
    const contrasenaInput = await driver.findElement(By.css(".contraseña input.form-control"));

    const toggleConfirmacion = await driver.findElement(By.css(".confirmacion_contraseña .form-check-input"));
    const confirmacionInput = await driver.findElement(By.css(".confirmacion_contraseña input.form-control"));

    console.log("\n🔍 Validando checkbox mostrar/ocultar contraseña...");

    // Contraseña
    await toggleContrasena.click();
    let tipo = await contrasenaInput.getAttribute("type");
    console.log("Campo contraseña visible:", tipo === "text");

    await toggleContrasena.click();
    tipo = await contrasenaInput.getAttribute("type");
    console.log("Campo contraseña oculto nuevamente:", tipo === "password");

    // Confirmación
    await toggleConfirmacion.click();
    tipo = await confirmacionInput.getAttribute("type");
    console.log("Campo confirmación visible:", tipo === "text");

    await toggleConfirmacion.click();
    tipo = await confirmacionInput.getAttribute("type");
    console.log("Campo confirmación oculto nuevamente:", tipo === "password");

    console.log("✅ Validación de mostrar/ocultar contraseña completada.\n");
  }

  async function llenarFormulario({
    nombre,
    email,
    contrasena,
    confirmacion,
    telefono,
    region,
    comuna
  }) {
    const inputNombre = await driver.findElement(By.css(".nombre input"));
    const inputEmail = await driver.findElement(By.css(".email input"));
    const inputContrasena = await driver.findElement(By.css(".contraseña input.form-control"));
    const inputConfirmacion = await driver.findElement(By.css(".confirmacion_contraseña input.form-control"));
    const inputTelefono = await driver.findElement(By.css(".telefono input"));
    const selectRegion = await driver.findElement(By.css(".region select"));
    const selectComuna = await driver.findElement(By.css(".comuna select"));
    const botonRegistrar = await driver.findElement(By.css("button[type='submit']"));

    // Limpiar y escribir datos
    await limpiarInput(inputNombre);
    await escribirLento(inputNombre, nombre);
    await limpiarInput(inputEmail);
    await escribirLento(inputEmail, email);
    await limpiarInput(inputContrasena);
    await escribirLento(inputContrasena, contrasena);
    await limpiarInput(inputConfirmacion);
    await escribirLento(inputConfirmacion, confirmacion);
    await limpiarInput(inputTelefono);
    await escribirLento(inputTelefono, telefono);

    // Selección de región y comuna
    if (region) {
      await selectRegion.click();
      await selectRegion.sendKeys(region);
      await sleep(500);
    }
    if (comuna) {
      await selectComuna.click();
      await selectComuna.sendKeys(comuna);
      await sleep(500);
    }

    // Clic seguro del botón
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonRegistrar);
    await sleep(800);

    try {
      await driver.wait(until.elementIsVisible(botonRegistrar), 4000);
      await driver.wait(until.elementIsEnabled(botonRegistrar), 4000);
      await botonRegistrar.click();
    } catch (e) {
      console.warn("⚠️ Primer clic falló, reintentando con JavaScript...");
      await driver.executeScript("arguments[0].click();", botonRegistrar);
    }
  }

  try {
    console.log("🧪 Iniciando prueba de RegistroUsuario...");
    await driver.get("http://localhost:3000/registroUsuario");
    await sleep(PAUSA_GENERAL);

    // Validar mostrar/ocultar contraseña
    await validarMostrarOcultarPassword();

    // === Caso exitoso ===
    console.log("\n✅ Caso: Registro exitoso");
    await llenarFormulario({
      nombre: "Felix Gonzalez",
      email: "felix_prueba@gmail.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc1!",
      telefono: "912345678",
      region: "metropolitana",
      comuna: "Santiago"
    });
    await capturarAlert("Formulario validado con éxito");
    await sleep(PAUSA_GENERAL);

    // === Casos erróneos ===
    const casos = [
      { desc: "Nombre vacío", data: { nombre: "", email: "correo@duoc.cl", contrasena: "Aabc1!", confirmacion: "Aabc1!", telefono: "912345678", region: "metropolitana", comuna: "Santiago" } },
      { desc: "Correo inválido", data: { nombre: "Felix", email: "correo@dominio.com", contrasena: "Aabc1!", confirmacion: "Aabc1!", telefono: "912345678", region: "metropolitana", comuna: "Santiago" } },
      { desc: "Contraseña insegura", data: { nombre: "Felix", email: "valido@duoc.cl", contrasena: "abc", confirmacion: "abc", telefono: "912345678", region: "metropolitana", comuna: "Santiago" } },
      { desc: "Confirmación distinta", data: { nombre: "Felix", email: "valido2@duoc.cl", contrasena: "Aabc1!", confirmacion: "Aabc2!", telefono: "912345678", region: "metropolitana", comuna: "Santiago" } },
      { desc: "Teléfono inválido", data: { nombre: "Felix", email: "valido3@duoc.cl", contrasena: "Aabc1!", confirmacion: "Aabc1!", telefono: "12345678", region: "metropolitana", comuna: "Santiago" } },
      { desc: "Región vacía", data: { nombre: "Felix", email: "valido4@duoc.cl", contrasena: "Aabc1!", confirmacion: "Aabc1!", telefono: "912345678", region: "", comuna: "" } },
      { desc: "Comuna vacía", data: { nombre: "Felix", email: "valido5@duoc.cl", contrasena: "Aabc1!", confirmacion: "Aabc1!", telefono: "912345678", region: "metropolitana", comuna: "" } }
    ];

    for (const caso of casos) {
      console.log(`\n⚙️ Caso: ${caso.desc}`);
      await llenarFormulario(caso.data);
      await capturarAlert();
      await sleep(PAUSA_GENERAL);
    }

    // Validar redirección
    console.log("\n🔗 Validando redirección a inicio de sesión...");
    const link = await driver.findElement(By.linkText("Inicia Sesión"));
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", link);
    await sleep(800);
    await link.click();
    await sleep(1500);
    const urlActual = await driver.getCurrentUrl();
    if (urlActual.includes("/inicioSesion")) {
      console.log("✅ Redirección a /inicioSesion correcta");
    } else {
      console.error("❌ Error en redirección. URL actual:", urlActual);
    }

    console.log("\n🎉 Prueba completa sin errores críticos.");
  } catch (err) {
    console.error("❌ Error en la ejecución del test:", err);
  } finally {
    await sleep(2000);
    await driver.quit();
  }
})();

  // PROBANDO COMMIT ABRIENDO FOLDER DEL ESCRITORIO