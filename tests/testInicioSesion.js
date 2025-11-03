// tests/testInicioSesion.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { Select } = require("selenium-webdriver/lib/select");

// 🕒 Simular tecleo humano
async function slowType(element, text, delay = 150) {
  for (const char of text) {
    await element.sendKeys(char);
    await new Promise((r) => setTimeout(r, delay));
  }
}

(async function testInicioSesion() {
  let options = new chrome.Options();
  options.addArguments("--start-maximized");

  let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  // 🔹 Correo corto y único
  const timestamp = Date.now().toString().slice(-5);
  const email = `u${timestamp}@gmail.com`;
  const password = "Aabc@123";
  const nombre = "UsuarioPrueba";

  try {
    console.log("🚀 Iniciando prueba automática (modo visual lento)...");
    console.log("📧 Email registrado:", email);
    console.log("🔑 Contraseña:", password);

    // 1️⃣ Registro
    await driver.get("http://localhost:3000/registroUsuario");
    await driver.wait(until.elementLocated(By.css("form.form_registro_usuario")), 10000);
    await driver.sleep(1000);

    await slowType(await driver.findElement(By.css(".nombre input")), nombre);
    await slowType(await driver.findElement(By.css(".email input")), email);

    const contrasenaInput = await driver.findElement(By.css(".contraseña input.form-control"));
    const mostrarPassCheck = await driver.findElement(By.css(".contraseña .form-check-input"));
    await mostrarPassCheck.click();
    await slowType(contrasenaInput, password);

    const confirmInput = await driver.findElement(By.css(".confirmacion_contraseña input.form-control"));
    const mostrarConfirmCheck = await driver.findElement(By.css(".confirmacion_contraseña .form-check-input"));
    await mostrarConfirmCheck.click();
    await slowType(confirmInput, password);

    await slowType(await driver.findElement(By.css(".telefono input")), "912345678");

    const regionSelect = new Select(await driver.findElement(By.css(".region select")));
    await regionSelect.selectByValue("metropolitana");
    await driver.sleep(500);
    const comunaSelect = new Select(await driver.findElement(By.css(".comuna select")));
    await comunaSelect.selectByValue("Santiago");

    await driver.findElement(By.css("button.btn.btn-primary")).click();

    await driver.wait(until.alertIsPresent(), 7000);
    const alertRegistro = await driver.switchTo().alert();
    const textoRegistro = await alertRegistro.getText();
    console.log("📢 Alerta registro:", textoRegistro);
    await driver.sleep(4000); // 👈 pausa para leer alerta
    await alertRegistro.accept();

    if (!textoRegistro.toLowerCase().includes("éxito") && !textoRegistro.toLowerCase().includes("validado")) {
      throw new Error("Registro inválido: " + textoRegistro);
    }

    // 🪄 Aviso visual
    await driver.executeScript(`
      alert("✅ Registro exitoso. Se probará el inicio de sesión con:\\n\\nEmail: ${email}\\nContraseña: ${password}");
    `);
    await driver.sleep(4000);
    try { await driver.switchTo().alert().accept(); } catch {}

    // 2️⃣ Inicio de sesión correcto
    await driver.get("http://localhost:3000/inicioSesion");
    await driver.wait(until.elementLocated(By.css("form.form_inicio_sesion")), 10000);

    const loginEmail = await driver.findElement(By.css(".correo input.form-control"));
    const loginPass = await driver.findElement(By.css(".contraseña input.form-control"));
    const mostrarPassLoginCheck = await driver.findElement(By.css(".contraseña .form-check-input"));

    await slowType(loginEmail, email);
    await mostrarPassLoginCheck.click();
    await slowType(loginPass, password);
    await driver.findElement(By.css("button.btn.btn-primary")).click();

    await driver.wait(until.alertIsPresent(), 7000);
    const alertLogin = await driver.switchTo().alert();
    const textoLogin = await alertLogin.getText();
    console.log("📢 Alerta login:", textoLogin);
    await driver.sleep(4000);
    await alertLogin.accept();

    if (textoLogin.toLowerCase().includes("exitoso")) {
      console.log("✅ TEST PASADO: Inicio de sesión exitoso con usuario recién registrado");
    } else {
      console.warn("⚠️ Aviso: El mensaje de login exitoso no fue el esperado.");
    }

    // 🚫 3️⃣ Escenario: correo incorrecto
    try {
      console.log("\n🚫 Probando login con correo incorrecto...");
      await driver.get("http://localhost:3000/inicioSesion");
      await driver.wait(until.elementLocated(By.css("form.form_inicio_sesion")), 10000);

      const wrongEmail = "x" + email;
      const loginEmailWrong = await driver.findElement(By.css(".correo input.form-control"));
      const loginPassWrong = await driver.findElement(By.css(".contraseña input.form-control"));
      const mostrarPassLoginWrong = await driver.findElement(By.css(".contraseña .form-check-input"));

      await slowType(loginEmailWrong, wrongEmail);
      await mostrarPassLoginWrong.click();
      await slowType(loginPassWrong, password);
      await driver.findElement(By.css("button.btn.btn-primary")).click();

      await driver.wait(until.alertIsPresent(), 7000);
      const alertLoginFail = await driver.switchTo().alert();
      const textoLoginFail = await alertLoginFail.getText();
      console.log("📢 Alerta login (fallido):", wrongEmail);
      await driver.sleep(4000);
      await alertLoginFail.accept();

      if (
        textoLoginFail.toLowerCase().includes("no registrado") ||
        textoLoginFail.toLowerCase().includes("incorrecta") ||
        textoLoginFail.toLowerCase().includes("fall")
      ) {
        console.log("✅ TEST PASADO: Se bloqueó correctamente el inicio de sesión con correo incorrecto");
      } else {
        console.warn("⚠️ Mensaje inesperado en login con correo incorrecto:", textoLoginFail);
      }
    } catch (e) {
      console.error("❌ Error interno durante la prueba de correo incorrecto:", e.message);
    }

    // 🚫 4️⃣ Escenario: contraseña incorrecta
    try {
      console.log("\n🚫 Probando login con contraseña incorrecta...");
      await driver.get("http://localhost:3000/inicioSesion");
      await driver.wait(until.elementLocated(By.css("form.form_inicio_sesion")), 10000);

      const loginEmailValid = await driver.findElement(By.css(".correo input.form-control"));
      const loginPassWrongPwd = await driver.findElement(By.css(".contraseña input.form-control"));
      const mostrarPassLoginWrongPwd = await driver.findElement(By.css(".contraseña .form-check-input"));

      const wrongPassword = "Zzzz@999";

      await slowType(loginEmailValid, email);
      await mostrarPassLoginWrongPwd.click();
      await slowType(loginPassWrongPwd, wrongPassword);
      await driver.findElement(By.css("button.btn.btn-primary")).click();

      await driver.wait(until.alertIsPresent(), 7000);
      const alertWrongPwd = await driver.switchTo().alert();
      const textoWrongPwd = await alertWrongPwd.getText();
      console.log("📢 Alerta login (contraseña incorrecta):", wrongPassword);
      await driver.sleep(4000);
      await alertWrongPwd.accept();

      if (
        textoWrongPwd.toLowerCase().includes("incorrecta") ||
        textoWrongPwd.toLowerCase().includes("inválida") ||
        textoWrongPwd.toLowerCase().includes("fall")
      ) {
        console.log("✅ TEST PASADO: Se bloqueó correctamente el inicio de sesión con contraseña incorrecta");
      } else {
        console.warn("⚠️ Mensaje inesperado en login con contraseña incorrecta:", textoWrongPwd);
      }
    } catch (e) {
      console.error("❌ Error interno durante la prueba de contraseña incorrecta:", e.message);
    }

    // ✅ 5️⃣ Validación de enlace “Regístrate”
    try {
      console.log("\n🔗 Verificando enlace 'Regístrate' desde la página de inicio de sesión...");

      await driver.get("http://localhost:3000/inicioSesion");
      await driver.wait(until.elementLocated(By.css("form.form_inicio_sesion")), 10000);

      let enlaceRegistro;
      try {
        enlaceRegistro = await driver.findElement(By.linkText("Regístrate"));
      } catch {
        enlaceRegistro =
          (await driver.findElement(By.partialLinkText("Regístrate")).catch(async () => {
            return await driver.findElement(By.css("a[href='/registroUsuario']"));
          })) || null;
      }

      if (!enlaceRegistro) throw new Error("No se encontró el enlace 'Regístrate'");

      await enlaceRegistro.click();
      await driver.wait(until.urlContains("/registroUsuario"), 7000);

      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes("/registroUsuario")) {
        console.log("✅ TEST PASADO: El enlace 'Regístrate' redirige correctamente a /registroUsuario");
      } else {
        console.warn("⚠️ TEST INCOMPLETO: URL inesperada tras hacer clic en 'Regístrate' →", currentUrl);
      }

      await driver.sleep(2000);
    } catch (e) {
      console.error("❌ Error durante la validación del enlace 'Regístrate':", e.message);
    }

    await driver.sleep(3000);
  } catch (err) {
    console.error("💥 Error general en el test:", err);
    await driver.sleep(3000);
  } finally {
    await driver.quit();
  }
})();
