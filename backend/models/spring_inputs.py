from pydantic import BaseModel

class CompressionSpringInput(BaseModel):
    wire_diameter: float
    coil_diameter: float
    active_coils: float
    shear_modulus: float