from pydantic import BaseModel


class CompressionSpringOutput(BaseModel):

    spring_rate: float

    outside_diameter: float
    inside_diameter: float

    spring_index: float

    solid_height: float

    stress: float