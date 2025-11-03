from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

PAUSA_GENERAL = 1.2  # segundos entre pruebas
PAUSA_ESCRITURA = 0.1  # segundos entre teclas
PAUSA_ALERTA = 2.5  # segundos que la alerta permanece visible antes de cerrarse


def escribir_lento(element, texto):
    for char in texto:
        element.send_keys(char)
        time.sleep(PAUSA_ESCRITURA)

def limpiar_input(element, driver):
    element.send_keys(Keys.CONTROL + "a")
    element.send_keys(Keys.BACKSPACE)
    driver.execute_script(
        "arguments[0].value = ''; arguments[0].dispatchEvent(new Event('input', { bubbles: true })); arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
        element)
    time.sleep(0.3)

def capturar_alert(driver, mensaje_esperado=""):
    try:
        WebDriverWait(driver, 4).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        texto = alert.text
        print(f"🔔 Alert capturado: {texto}")
        time.sleep(PAUSA_ALERTA)
        if mensaje_esperado and mensaje_esperado not in texto:
            print("⚠️ El mensaje no coincide con lo esperado.")
        alert.accept()
        print("✅ Alerta cerrada después del tiempo de visualización.")
    except:
        print("⚠️ No se mostró alerta en este caso.")

def validar_mostrar_ocultar_password(driver):
    toggle_contrasena = driver.find_element(By.CSS_SELECTOR, ".contraseña .form-check-input")
    contrasena_input = driver.find_element(By.CSS_SELECTOR, ".contraseña input.form-control")
    toggle_confirmacion = driver.find_element(By.CSS_SELECTOR, ".confirmacion_contraseña .form-check-input")
    confirmacion_input = driver.find_element(By.CSS_SELECTOR, ".confirmacion_contraseña input.form-control")
    print("\n🔍 Validando checkbox mostrar/ocultar contraseña...")
    # Contraseña
    toggle_contrasena.click()
    tipo = contrasena_input.get_attribute("type")
    print("Campo contraseña visible:", tipo == "text")
    toggle_contrasena.click()
    tipo = contrasena_input.get_attribute("type")
    print("Campo contraseña oculto nuevamente:", tipo == "password")
    # Confirmación
    toggle_confirmacion.click()
    tipo = confirmacion_input.get_attribute("type")
    print("Campo confirmación visible:", tipo == "text")
    toggle_confirmacion.click()
    tipo = confirmacion_input.get_attribute("type")
    print("Campo confirmación oculto nuevamente:", tipo == "password")
    print("✅ Validación de mostrar/ocultar contraseña completada.\n")

def llenar_formulario(driver, nombre, email, contrasena, confirmacion, telefono, region, comuna):
    input_nombre = driver.find_element(By.CSS_SELECTOR, ".nombre input")
    input_email = driver.find_element(By.CSS_SELECTOR, ".email input")
    input_contrasena = driver.find_element(By.CSS_SELECTOR, ".contraseña input.form-control")
    input_confirmacion = driver.find_element(By.CSS_SELECTOR, ".confirmacion_contraseña input.form-control")
    input_telefono = driver.find_element(By.CSS_SELECTOR, ".telefono input")
    from selenium.webdriver.support.ui import Select
    select_region = None
    select_comuna = None
    try:
        element_region = driver.find_element(By.ID, "regionSelect")
        select_region = Select(element_region)
    except:
        select_region = None
    try:
        element_comuna = driver.find_element(By.ID, "comunaSelect")
        select_comuna = Select(element_comuna)
    except:
        select_comuna = None
    boton_registrar = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    # Limpiar y escribir datos
    limpiar_input(input_nombre, driver)
    escribir_lento(input_nombre, nombre)
    limpiar_input(input_email, driver)
    escribir_lento(input_email, email)
    limpiar_input(input_contrasena, driver)
    escribir_lento(input_contrasena, contrasena)
    limpiar_input(input_confirmacion, driver)
    escribir_lento(input_confirmacion, confirmacion)
    limpiar_input(input_telefono, driver)
    escribir_lento(input_telefono, telefono)
    # Selección de región y comuna usando Select por texto visible
    if select_region and region:
        try:
            select_region.select_by_visible_text(region)
            time.sleep(0.5)
        except Exception as e:
            print(f"⚠️ No se pudo seleccionar región: {e}")
    if select_comuna and comuna:
        try:
            select_comuna.select_by_visible_text(comuna)
            time.sleep(0.5)
        except Exception as e:
            print(f"⚠️ No se pudo seleccionar comuna: {e}")
    # Clic solo por JavaScript para evitar interceptación
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", boton_registrar)
    time.sleep(1.2)
    try:
        driver.execute_script("arguments[0].click();", boton_registrar)
    except Exception as js_e:
        print(f"❌ Clic por JavaScript falló: {js_e}")

def main():
    driver = webdriver.Chrome()
    try:
        print("🧪 Iniciando prueba de RegistroUsuario...")
        driver.get("http://localhost:3000/register")
        time.sleep(PAUSA_GENERAL)
        validar_mostrar_ocultar_password(driver)
        # Caso exitoso
        print("\n✅ Caso: Registro exitoso")
        llenar_formulario(driver,
            nombre="Felix Gonzalez",
            email="felix_prueba@gmail.com",
            contrasena="Aabc1!",
            confirmacion="Aabc1!",
            telefono="912345678",
            region="metropolitana",
            comuna="Santiago"
        )
        capturar_alert(driver, "Formulario validado con éxito")
        time.sleep(PAUSA_GENERAL)
        # Casos erróneos
        casos = [
            {"desc": "Nombre vacío", "data": {"nombre": "", "email": "correo@duoc.cl", "contrasena": "Aabc1!", "confirmacion": "Aabc1!", "telefono": "912345678", "region": "metropolitana", "comuna": "Santiago"}},
            {"desc": "Correo inválido", "data": {"nombre": "Felix", "email": "correo@dominio.com", "contrasena": "Aabc1!", "confirmacion": "Aabc1!", "telefono": "912345678", "region": "metropolitana", "comuna": "Santiago"}},
            {"desc": "Contraseña insegura", "data": {"nombre": "Felix", "email": "valido@duoc.cl", "contrasena": "abc", "confirmacion": "abc", "telefono": "912345678", "region": "metropolitana", "comuna": "Santiago"}},
            {"desc": "Confirmación distinta", "data": {"nombre": "Felix", "email": "valido2@duoc.cl", "contrasena": "Aabc1!", "confirmacion": "Aabc2!", "telefono": "912345678", "region": "metropolitana", "comuna": "Santiago"}},
            {"desc": "Teléfono inválido", "data": {"nombre": "Felix", "email": "valido3@duoc.cl", "contrasena": "Aabc1!", "confirmacion": "Aabc1!", "telefono": "12345678", "region": "metropolitana", "comuna": "Santiago"}},
            {"desc": "Región vacía", "data": {"nombre": "Felix", "email": "valido4@duoc.cl", "contrasena": "Aabc1!", "confirmacion": "Aabc1!", "telefono": "912345678", "region": "", "comuna": ""}},
            {"desc": "Comuna vacía", "data": {"nombre": "Felix", "email": "valido5@duoc.cl", "contrasena": "Aabc1!", "confirmacion": "Aabc1!", "telefono": "912345678", "region": "metropolitana", "comuna": ""}}
        ]
        for caso in casos:
            print(f"\n⚙️ Caso: {caso['desc']}")
            llenar_formulario(driver, **caso["data"])
            capturar_alert(driver)
            time.sleep(PAUSA_GENERAL)
        # Validar redirección
        print("\n🔗 Validando redirección a inicio de sesión...")
        link = driver.find_element(By.LINK_TEXT, "Inicia Sesión")
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", link)
        time.sleep(0.8)
        link.click()
        time.sleep(1.5)
        url_actual = driver.current_url
        if "/login" in url_actual:
            print("✅ Redirección a /login correcta")
        else:
            print(f"❌ Error en redirección. URL actual: {url_actual}")
        print("\n🎉 Prueba completa sin errores críticos.")
    except Exception as err:
        print(f"❌ Error en la ejecución del test: {err}")
    finally:
        time.sleep(2)
        driver.quit()

if __name__ == "__main__":
    main()
