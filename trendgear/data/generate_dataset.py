"""
TrendGear - Generador de Dataset Sintético
Fase I: Ingeniería y Modelado de Datos

Genera un dataset sintético de clientes de e-commerce con las 11 columnas
requeridas, respetando el checklist de validación de integridad del taller:
  - Age entre 13 y 100
  - Amount Spent >= 0
  - Fechas en formato ISO YYYY-MM-DD, sin fechas futuras
  - Purchase Date <= Last Login Date
  - Categorías normalizadas (Title Case)
  - Customer ID único, sin duplicados
  - Emails con dominio seguro (mailinator.com)
  - Ciudad tomada de un catálogo cerrado y coherente
"""

import csv
import random
from datetime import date, timedelta

random.seed(42)  # reproducibilidad

# ---------------------------------------------------------------------------
# Catálogos base (controlan la coherencia cruzada del dataset)
# ---------------------------------------------------------------------------
FIRST_NAMES = [
    "Sofia", "Mateo", "Valentina", "Santiago", "Isabella", "Sebastian",
    "Camila", "Nicolas", "Valeria", "Samuel", "Luciana", "Emiliano",
    "Renata", "Gabriel", "Antonella", "Andres", "Daniela", "Julian",
    "Martina", "Alejandro", "Paula", "Diego", "Carolina", "Felipe",
    "Manuela", "Esteban", "Laura", "David", "Natalia", "Miguel",
]

LAST_NAMES = [
    "Gomez", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera",
    "Diaz", "Vargas", "Castro", "Ortiz", "Morales", "Suarez",
    "Rojas", "Reyes",
]

PRODUCTS = [
    "Laptop Pro 14", "Smartphone X200", "Auriculares Noise Cancel",
    "Monitor 27 4K", "Teclado Mecanico RGB", "Mouse Inalambrico Pro",
    "Tablet Air 11", "Smartwatch Fit 3", "Camara Web HD",
    "Parlante Bluetooth Max", "SSD Externo 1TB", "Cargador Rapido 65W",
]

CITIES = [
    "Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena",
    "Bucaramanga", "Cucuta", "Pereira", "Santa Marta", "Manizales",
]

PAYMENT_METHODS = ["Credit Card", "Debit Card", "PayPal", "Bank Transfer"]

MEMBERSHIP_STATUS = ["Bronze", "Silver", "Gold", "Platinum"]

EMAIL_DOMAIN = "mailinator.com"

TODAY = date(2026, 7, 16)  # fecha de referencia del taller (fecha actual)
DATASET_START = date(2024, 1, 1)  # ventana de compras: no antes de esta fecha


def random_date(start: date, end: date) -> date:
    """Fecha aleatoria uniforme entre start y end (inclusive)."""
    delta_days = (end - start).days
    return start + timedelta(days=random.randint(0, delta_days))


def build_row(customer_id: int) -> dict:
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    name = f"{first} {last}"
    email = f"{first.lower()}.{last.lower()}{customer_id}@{EMAIL_DOMAIN}"

    age = random.randint(13, 78)  # rango realista de compradores, dentro de 13-100
    amount = round(random.uniform(15.0, 2500.0), 2)

    purchase_date = random_date(DATASET_START, TODAY)
    # Last Login Date siempre >= Purchase Date y nunca en el futuro
    login_date = random_date(purchase_date, TODAY)

    return {
        "Customer ID": f"TG-{customer_id:04d}",
        "Name": name,
        "Email": email,
        "Product Purchased": random.choice(PRODUCTS),
        "Purchase Date": purchase_date.isoformat(),
        "Amount Spent (USD)": f"{amount:.2f}",
        "Age": age,
        "City": random.choice(CITIES),
        "Payment Method": random.choice(PAYMENT_METHODS),
        "Last Login Date": login_date.isoformat(),
        "Membership Status": random.choice(MEMBERSHIP_STATUS),
    }


def validate(rows: list[dict]) -> list[str]:
    """Aplica el checklist de integridad del taller. Devuelve lista de errores."""
    errors = []
    seen_ids = set()
    seen_emails = set()

    for r in rows:
        cid = r["Customer ID"]
        if cid in seen_ids:
            errors.append(f"ID duplicado: {cid}")
        seen_ids.add(cid)

        if not (13 <= int(r["Age"]) <= 100):
            errors.append(f"{cid}: edad fuera de rango ({r['Age']})")

        if float(r["Amount Spent (USD)"]) < 0:
            errors.append(f"{cid}: monto negativo")

        try:
            pd = date.fromisoformat(r["Purchase Date"])
            ld = date.fromisoformat(r["Last Login Date"])
        except ValueError:
            errors.append(f"{cid}: formato de fecha invalido")
            continue

        if pd > TODAY or ld > TODAY:
            errors.append(f"{cid}: fecha futura detectada")
        if pd > ld:
            errors.append(f"{cid}: Purchase Date posterior a Last Login Date")

        if r["Payment Method"] not in PAYMENT_METHODS:
            errors.append(f"{cid}: metodo de pago no normalizado")
        if r["City"] not in CITIES:
            errors.append(f"{cid}: ciudad fuera de catalogo")
        if not r["Email"].endswith(f"@{EMAIL_DOMAIN}"):
            errors.append(f"{cid}: dominio de correo no seguro")
        if r["Email"] in seen_emails:
            errors.append(f"{cid}: email duplicado")
        seen_emails.add(r["Email"])

    return errors


def main(n_rows: int = 60) -> None:
    rows = [build_row(i + 1) for i in range(n_rows)]

    errors = validate(rows)
    if errors:
        print(f"Se encontraron {len(errors)} problema(s) de validacion:")
        for e in errors[:20]:
            print(f"  - {e}")
        raise SystemExit(1)

    fieldnames = list(rows[0].keys())
    out_path = "trendgear_dataset.csv"
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Dataset generado y validado: {out_path} ({len(rows)} registros)")


if __name__ == "__main__":
    main()
