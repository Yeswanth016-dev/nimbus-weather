import { Router } from 'express';
import {
  createWeatherSearch,
  getWeatherHistory,
  getWeatherById,
  updateWeatherRecord,
  deleteWeatherRecord,
  exportWeatherJson,
  exportWeatherCsv,
  exportWeatherPdf,
  exportWeatherXml,
  exportWeatherMarkdown,
  getWeatherHistoryRange,
  getWeatherAdvice,
} from '../controllers/weatherController.js';
import { validateWeatherQuery, validateObjectId } from '../middleware/validateRequest.js';

const router = Router();

// Export & range/query routes must come before "/:id" so these path segments
// aren't parsed as a Mongo ObjectId.
router.get('/export/json', exportWeatherJson);
router.get('/export/csv', exportWeatherCsv);
router.get('/export/pdf', exportWeatherPdf);
router.get('/export/xml', exportWeatherXml);
router.get('/export/markdown', exportWeatherMarkdown);
router.get('/history-range', getWeatherHistoryRange);

router.route('/').post(validateWeatherQuery, createWeatherSearch).get(getWeatherHistory);

router.post('/:id/advice', validateObjectId, getWeatherAdvice);

router
  .route('/:id')
  .get(validateObjectId, getWeatherById)
  .put(validateObjectId, updateWeatherRecord)
  .delete(validateObjectId, deleteWeatherRecord);

export default router;
