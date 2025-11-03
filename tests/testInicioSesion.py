from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time
import random

# 🕒 Simular tecleo humano
def slow_type(element, text, delay=0.15):
    for char in text:
        element.send_keys(char)
        time.sleep(delay)

# Configuración
options = webdriver.ChromeOptions()
options.add_argument('--start-maximized')
driver = webdriver.Chrome(options=options)

timestamp = str(int(time.time()))[-5:]
email = f"u{timestamp}@gmail.com"
password = "Aabc@123"
nombre = "UsuarioPrueba"

try:
    print("🚀 Iniciando prueba automática (modo visual lento)...")
    print("📧 Email registrado:", email)
    print("🔑 Contraseña:", password)

    # 1️⃣ Registro
    driver.get("http://localhost:3000/register")
    time.sleep(2)

    slow_type(driver.find_element(By.CSS_SELECTOR, ".nombre input"), nombre)
    slow_type(driver.find_element(By.CSS_SELECTOR, ".email input"), email)

    contrasena_input = driver.find_element(By.CSS_SELECTOR, ".contraseña input.form-control")
    mostrar_pass_check = driver.find_element(By.CSS_SELECTOR, ".contraseña .form-check-input")
    mostrar_pass_check.click()
    slow_type(contrasena_input, password)

    confirm_input = driver.find_element(By.CSS_SELECTOR, ".confirmacion_contraseña input.form-control")
    mostrar_confirm_check = driver.find_element(By.CSS_SELECTOR, ".confirmacion_contraseña .form-check-input")
    mostrar_confirm_check.click()
    slow_type(confirm_input, password)

    slow_type(driver.find_element(By.CSS_SELECTOR, ".telefono input"), "912345678")

    region_select = Select(driver.find_element(By.CSS_SELECTOR, ".region select"))
    region_select.select_by_value("metropolitana")
    time.sleep(0.5)
    comuna_select = Select(driver.find_element(By.CSS_SELECTOR, ".comuna select"))
    comuna_select.select_by_value("Santiago")

    driver.find_element(By.CSS_SELECTOR, "button.btn.btn-primary").click()
    time.sleep(2)

    # Espera alerta de registro
    try:
        alert = driver.switch_to.alert
        texto_registro = alert.text
        print("📢 Alerta registro:", texto_registro)
        time.sleep(2)
        alert.accept()
        if not ("éxito" in texto_registro.lower() or "validado" in texto_registro.lower()):
            raise Exception("Registro inválido: " + texto_registro)
    except:
        print("❌ No se recibió alerta de registro")

    # 2️⃣ Inicio de sesión correcto
    driver.get("http://localhost:3000/login")
    time.sleep(2)
    login_email = driver.find_element(By.CSS_SELECTOR, ".correo input.form-control")
    login_pass = driver.find_element(By.CSS_SELECTOR, ".contraseña input.form-control")
    mostrar_pass_login_check = driver.find_element(By.CSS_SELECTOR, ".contraseña .form-check-input")
    slow_type(login_email, email)
    mostrar_pass_login_check.click()
    slow_type(login_pass, password)
    driver.find_element(By.CSS_SELECTOR, "button.btn.btn-primary").click()
    time.sleep(2)
    try:
        alert_login = driver.switch_to.alert
        texto_login = alert_login.text
        print("📢 Alerta login:", texto_login)
        time.sleep(2)
        alert_login.accept()
        if "exitoso" in texto_login.lower():
            print("✅ TEST PASADO: Inicio de sesión exitoso con usuario recién registrado")
        else:
            print("⚠️ Aviso: El mensaje de login exitoso no fue el esperado.")
    except:
        print("❌ No se recibió alerta de login")

    # 🚫 3️⃣ Escenario: correo incorrecto
    print("\n🚫 Probando login con correo incorrecto...")
    driver.get("http://localhost:3000/login")
    time.sleep(2)
    wrong_email = "x" + email
    login_email_wrong = driver.find_element(By.CSS_SELECTOR, ".correo input.form-control")
    login_pass_wrong = driver.find_element(By.CSS_SELECTOR, ".contraseña input.form-control")
    mostrar_pass_login_wrong = driver.find_element(By.CSS_SELECTOR, ".contraseña .form-check-input")
    slow_type(login_email_wrong, wrong_email)
    mostrar_pass_login_wrong.click()
    slow_type(login_pass_wrong, password)
    driver.find_element(By.CSS_SELECTOR, "button.btn.btn-primary").click()
    time.sleep(2)
    try:
        alert_login_fail = driver.switch_to.alert
        texto_login_fail = alert_login_fail.text
        print("📢 Alerta login (fallido):", wrong_email)
        time.sleep(2)
        alert_login_fail.accept()
        if ("no registrado" in texto_login_fail.lower() or "incorrecta" in texto_login_fail.lower() or "fall" in texto_login_fail.lower()):
            print("✅ TEST PASADO: Se bloqueó correctamente el inicio de sesión con correo incorrecto")
        else:
            print("⚠️ Mensaje inesperado en login con correo incorrecto:", texto_login_fail)
    except:
        print("❌ No se recibió alerta de login con correo incorrecto")

    # 🚫 4️⃣ Escenario: contraseña incorrecta
    print("\n🚫 Probando login con contraseña incorrecta...")
    driver.get("http://localhost:3000/login")
    time.sleep(2)
    login_email_valid = driver.find_element(By.CSS_SELECTOR, ".correo input.form-control")
    login_pass_wrong_pwd = driver.find_element(By.CSS_SELECTOR, ".contraseña input.form-control")
    mostrar_pass_login_wrong_pwd = driver.find_element(By.CSS_SELECTOR, ".contraseña .form-check-input")
    wrong_password = "Zzzz@999"
    slow_type(login_email_valid, email)
    mostrar_pass_login_wrong_pwd.click()
    slow_type(login_pass_wrong_pwd, wrong_password)
    driver.find_element(By.CSS_SELECTOR, "button.btn.btn-primary").click()
    time.sleep(2)
    try:
        alert_wrong_pwd = driver.switch_to.alert
        texto_wrong_pwd = alert_wrong_pwd.text
        print("📢 Alerta login (contraseña incorrecta):", wrong_password)
        time.sleep(2)
        alert_wrong_pwd.accept()
        if ("incorrecta" in texto_wrong_pwd.lower() or "inválida" in texto_wrong_pwd.lower() or "fall" in texto_wrong_pwd.lower()):
            print("✅ TEST PASADO: Se bloqueó correctamente el inicio de sesión con contraseña incorrecta")
        else:
            print("⚠️ Mensaje inesperado en login con contraseña incorrecta:", texto_wrong_pwd)
    except:
        print("❌ No se recibió alerta de login con contraseña incorrecta")

    # ✅ 5️⃣ Validación de enlace “Regístrate”
    print("\n🔗 Verificando enlace 'Regístrate' desde la página de inicio de sesión...")
    driver.get("http://localhost:3000/login")
    time.sleep(2)
    try:
        enlace_registro = driver.find_element(By.LINK_TEXT, "Regístrate")
    except:
        try:
            enlace_registro = driver.find_element(By.PARTIAL_LINK_TEXT, "Regístrate")
        except:
            enlace_registro = driver.find_element(By.CSS_SELECTOR, "a[href='/register']")
    enlace_registro.click()
    time.sleep(2)
    current_url = driver.current_url
    if "/register" in current_url:
        print("✅ TEST PASADO: El enlace 'Regístrate' redirige correctamente a /register")
    else:
        print("⚠️ TEST INCOMPLETO: URL inesperada tras hacer clic en 'Regístrate' →", current_url)
    time.sleep(2)

    time.sleep(2)
except Exception as err:
    print("💥 Error general en el test:", err)
    time.sleep(2)
finally:
    driver.quit()
