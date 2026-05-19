from pydantic import BaseModel

class GraphPoint(BaseModel):

    deflection: float
    force: float

class CompressionSpringOutput(BaseModel):

    spring_rate: float

    outside_diameter: float
    inside_diameter: float

    spring_index: float

    solid_height: float

    stress: float

    graph_data: list[GraphPoint]