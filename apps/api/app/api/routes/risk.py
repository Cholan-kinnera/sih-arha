"""Dynamic Risk Evaluation Routes (Async)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.session import get_async_db
from apps.api.app.schemas.risk import RiskEvaluationResponse, RiskMatrixResponse
from apps.api.app.services.risk_service import get_current_risk_matrix, get_zone_latest_risk

router = APIRouter(prefix="/risk", tags=["Risk"])


@router.get(
    "",
    response_model=RiskMatrixResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current dynamic risk matrix for all monitored zones",
)
async def get_risk_matrix(db: AsyncSession = Depends(get_async_db)) -> RiskMatrixResponse:
    """Retrieve full dynamic risk matrix and regional severity distribution across all zones."""
    return await get_current_risk_matrix(db=db)


@router.get(
    "/current",
    response_model=RiskMatrixResponse,
    status_code=status.HTTP_200_OK,
    summary="Alias for current dynamic risk matrix",
)
async def get_current_risk_matrix_alias(db: AsyncSession = Depends(get_async_db)) -> RiskMatrixResponse:
    """Alias route for retrieving the latest risk evaluations across all zones."""
    return await get_current_risk_matrix(db=db)


@router.get(
    "/{zone_id}",
    response_model=RiskEvaluationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get dynamic risk evaluation and evidence bundle for single zone",
)
async def get_zone_risk(zone_id: str, db: AsyncSession = Depends(get_async_db)) -> RiskEvaluationResponse:
    """Retrieve the latest multi-factor dynamic risk score and explainable evidence bundle for a zone."""
    evaluation = await get_zone_latest_risk(db=db, zone_id=zone_id)
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zone '{zone_id}' not found or risk evaluation could not be computed.",
        )
    return evaluation
