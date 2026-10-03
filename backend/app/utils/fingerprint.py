import hashlib

from app.core.config import settings

def generate_fingerprint(title: str, issuer_name: str, issued_date: str, credential_id: str = "") -> str:
    """
    Generates a 12-character SHA-256 derived verification fingerprint using a secret salt.
    """
    secret = settings.JWT_SECRET
    raw = f"{title.strip().lower()}|{issuer_name.strip().lower()}|{issued_date}|{credential_id.strip().lower()}|{secret}"
    digest = hashlib.sha256(raw.encode()).hexdigest().upper()
    fingerprint = "".join(digest[i] for i in range(0, 48, 4))
    return fingerprint
