import Student from "../models/student.js";

export function getStudents(req, res) {
  Student.find()
    .then((students) => {
      res.json(students);
    })
    .catch(() => console.log("failed to fetch student"));
}

export function createStudents(req, res) {
  if (req.user==null) {
    res.status(403).json({
          message:"Please Log again "
        })
        return
  }
  if (req.user.role !="admin") {
    res.status(403).json({
          message:"Please Log as a admin to create a student"
        })
        return
  }

  const student = new Student({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
  });

  student
    .save()
    .then(() => console.log("Student Saved"))
    .catch(() => console.log("failed to save student"));
}
