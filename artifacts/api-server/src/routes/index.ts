import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import settingsRouter from "./settings";
import heroSlidesRouter from "./heroSlides";
import pagesRouter from "./pages";
import teamRouter from "./team";
import projectsRouter from "./projects";
import newsRouter from "./news";
import eventsRouter from "./events";
import galleryRouter from "./gallery";
import partnersRouter from "./partners";
import opportunitiesRouter from "./opportunities";
import contactRouter from "./contact";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(settingsRouter);
router.use(heroSlidesRouter);
router.use(pagesRouter);
router.use(teamRouter);
router.use(projectsRouter);
router.use(newsRouter);
router.use(eventsRouter);
router.use(galleryRouter);
router.use(partnersRouter);
router.use(opportunitiesRouter);
router.use(contactRouter);
router.use(statsRouter);

export default router;
