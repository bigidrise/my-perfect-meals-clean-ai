// import foodLogsRouter from "./foodLogs"; // TEMPORARILY DISABLED - File missing
// ...
// app.use(foodLogsRouter); // TEMPORARILY DISABLED - File missing

import diabetesRoutes from "./diabetes";
import glp1ShotsRoutes from "./glp1Shots";
import patientAssignmentRoutes from "./patientAssignment";

// ...

app.use("/api/diabetes", diabetesRoutes);
  app.use("/api/glp1-shots", glp1ShotsRoutes);
  app.use("/api/patients", patientAssignmentRoutes);