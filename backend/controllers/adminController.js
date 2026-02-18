// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    // console.log(req.body)
    const {name, email, password, speciality, degree, experience, about} = req.body;

    //const imageFile = req.file; 

    console.log({ name, email, password, speciality, degree, experience, about });

    return res.status(201).json({
      message: "Doctor added successfully",
      data: { name, email, password, speciality, degree, experience, about },
    });
  } catch (error) {
    console.error("Error in addDoctor:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { addDoctor };
