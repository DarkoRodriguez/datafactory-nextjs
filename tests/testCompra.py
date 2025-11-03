from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time


driver = webdriver.Chrome()

try:
  
    driver.get("http://localhost:3000/")  # Cambia la URL si está desplegado

   
    time.sleep(2)
    # Navega directamente a la página de productos
    driver.get("http://localhost:3000/productos")
    time.sleep(2)
    driver.find_elements(By.CSS_SELECTOR, ".product-grid .card")[0].click()
    time.sleep(2)

    
    driver.find_element(By.ID, "btn-add").click()
    time.sleep(1)

    alert = driver.switch_to.alert
    alert.accept()
    
    driver.get("http://localhost:3000/checkout")
    time.sleep(2)

   

    # Rellenar los campos del formulario por orden
    inputs = driver.find_elements(By.CSS_SELECTOR, "form input")
    inputs[0].send_keys("Juan")         # Nombre
    inputs[1].send_keys("Pérez")        # Apellidos
    inputs[2].send_keys("juan@example.com")  # Correo
    inputs[3].send_keys("Calle Falsa 123")   # Calle
    # inputs[4] es departamento (opcional)
            # Comuna
    time.sleep(1)

   
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)

    
    assert "Se ha realizado la compra" in driver.page_source
    print("Compra realizada con éxito.")
finally:
    driver.quit()