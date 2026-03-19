import re

def parse_command(text):

    text = text.lower()

    if "add" in text:
        quantity = re.findall(r'\d+', text)
        product = text.replace("add", "").strip()

        return {
            "action": "add",
            "product": product,
            "quantity": int(quantity[0]) if quantity else 1
        }

    if "clear fresh" in text:
        return {"action": "clear", "type": "fresh"}

    if "clear shopping" in text:
        return {"action": "clear", "type": "shopping"}

    if "clear all" in text:
        return {"action": "clear", "type": "all"}

    return {"action": "unknown"}