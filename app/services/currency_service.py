import time
import httpx

_cache: dict[str, tuple[float, float]] = {}

async def convert(amount: float, from_currency: str, to_currency: str):
    if from_currency.upper() == to_currency.upper(): return {"amount": amount, "from": from_currency.upper(), "to": to_currency.upper(), "converted_amount": amount, "rate": 1.0}
    key = f"{from_currency.upper()}:{to_currency.upper()}"
    cached = _cache.get(key)
    if cached and time.time() - cached[1] < 3600: rate = cached[0]
    else:
        try:
            async with httpx.AsyncClient(timeout=8) as client:
                response = await client.get(f"https://open.er-api.com/v6/latest/{from_currency.upper()}")
                response.raise_for_status(); rate = float(response.json()["rates"][to_currency.upper()])
                _cache[key] = (rate, time.time())
        except (httpx.HTTPError, KeyError):
            raise ValueError("Taux de change indisponible pour cette paire de devises")
    return {"amount": amount, "from": from_currency.upper(), "to": to_currency.upper(), "converted_amount": round(amount * rate, 2), "rate": rate}
