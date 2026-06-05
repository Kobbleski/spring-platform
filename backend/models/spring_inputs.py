from typing import Literal, Self

from pydantic import BaseModel, Field, model_validator

SpringMaterial = Literal["Music Wire", "Stainless Steel", "Phosphor Bronze"]


class BaseHelicalSpringInput(BaseModel):

    wire_diameter: float = Field(gt=0)

    coil_diameter: float = Field(gt=0)

    active_coils: float = Field(gt=0)

    material: SpringMaterial

    @model_validator(mode="after")
    def validate_geometry(self) -> Self:

        if self.coil_diameter <= self.wire_diameter:
            raise ValueError("coil_diameter must be larger than wire_diameter")

        return self


class CompressionSpringInput(BaseHelicalSpringInput):

    force: float = Field(ge=0)


class ExtensionSpringInput(BaseHelicalSpringInput):

    force: float = Field(ge=0)

    initial_tension: float = Field(ge=0)


class RoundWireTorsionSpringInput(BaseHelicalSpringInput):

    angle_degrees: float = Field(ge=0)


class SquareSectionTorsionSpringInput(BaseHelicalSpringInput):

    angle_degrees: float = Field(ge=0)
