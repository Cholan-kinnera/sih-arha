import logging
import sys
from apps.api.src.core.config import settings


def setup_logging() -> logging.Logger:
    """Configure structured logging for the backend application."""
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    logger = logging.getLogger("cbip.api")
    logger.setLevel(log_level)
    return logger


logger = setup_logging()
