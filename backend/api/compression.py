from fastapi import APIRouter

from models.spring_inputs import CompressionSpringInput
from models.spring_outputs import CompressionSpringOutput

from calculations.compression import calculate_compression_spring

router = APIRouter()


@router.post(
    "/calculate",
    response_model=CompressionSpringOutput
)
def calculate(inputs: CompressionSpringInput):

    result = calculate_compression_spring(inputs)

    return result