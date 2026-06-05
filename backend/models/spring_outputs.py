from typing import Literal

from pydantic import BaseModel


class GraphPoint(BaseModel):

    deflection: float
    force: float


class CompressionSpringOutput(BaseModel):

    spring_type: Literal["compression"]

    spring_rate: float

    outside_diameter: float
    inside_diameter: float

    spring_index: float

    solid_height: float

    stress: float

    graph_data: list[GraphPoint]


class ExtensionSpringOutput(BaseModel):

    spring_type: Literal["extension"]

    spring_rate: float

    outside_diameter: float
    inside_diameter: float

    spring_index: float

    initial_tension: float

    extension: float

    stress: float

    graph_data: list[GraphPoint]


class TorsionSpringOutput(BaseModel):

    spring_type: Literal["round_torsion", "square_torsion"]

    torque_rate: float

    torque: float

    outside_diameter: float
    inside_diameter: float

    spring_index: float

    bending_stress: float

    graph_data: list[GraphPoint]
