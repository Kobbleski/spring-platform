from typing import Literal, Self

from pydantic import BaseModel, Field, model_validator


class CompressionSpringInput(BaseModel):

    wire_diameter: float = Field(gt=0)

    coil_diameter: float = Field(gt=0)

    active_coils: float = Field(gt=0)

    force: float = Field(ge=0)

    material: Literal["Music Wire", "Stainless Steel", "Phosphor Bronze"]

    @model_validator(mode="after")
    def validate_geometry(self) -> Self:

        if self.coil_diameter <= self.wire_diameter:
            raise ValueError("coil_diameter must be larger than wire_diameter")

        return self
