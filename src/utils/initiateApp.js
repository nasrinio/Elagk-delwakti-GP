import { connectionDB } from "../../DB/connection.js";
import { globalResponse } from "./errorhandling.js";
import * as routers from "../modules/index.routes.js";
import cors from "cors";
import {reminderCronJob} from './crons.js'
import { gracefulShutdown } from "node-schedule";


export const initiateApp = (app, express) => {
  const port = process.env.PORT;

  app.use(express.json());
  //app.use(express.urlencoded({ extended: false }));

  connectionDB();
  app.use(cors());

  app.get("/", (req, res) => res.send("Hello from Elagk delwakty backend !"));
  app.use("/pharmacy", routers.pharmacyRouter);
  app.use("/medicine", routers.medicineRouter);
  app.use("/auth", routers.auhtRouter);
  app.use("/reminder", routers.reminderRouter);
  app.use("/city", routers.cityRouter);
  app.use("/governate", routers.governateRouter);
  app.use("/medicineCategory", routers.medicineCategoryRouter);
  app.use("/prescription", routers.prescriptionRouter);

  
  app.all("*", (req, res, next) =>
    res.status(404).json({ message: "404 Not Found URL" })
  );

  reminderCronJob();
  gracefulShutdown();
  app.use(globalResponse);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
