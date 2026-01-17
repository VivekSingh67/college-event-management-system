const registerStudentModel = require('../models/studentAuth.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerStudent = async (req, res) => {
    let { fullname, email, mobile, department, year, password } = req.body;

    if (!fullname || !email || !mobile || !department || !year || !password) {
        return res.status(401).json({
            message: "All field are required"
        })
    }

    const isAlreadyExist = await registerStudentModel.findOne({ email: email })

    if (isAlreadyExist) {
        return res.status(401).json({
            message: "This email already register"
        })
    }

    let hashPassword = await bcrypt.hash(password, 10);
    const student = await registerStudentModel.create({
        fullname,
        email,
        mobile,
        department,
        year,
        password: hashPassword
    })

    let token = jwt.sign({ id: student._id, email: student.email, role: student.role }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(200).json({
        message: "Studend Created Successfully",
        student
    })
}

const loginStudent = async (req, res) => {
    let { email, password } = req.body;

    let student = await registerStudentModel.findOne({ email: email }).select("+password")
    if (!student) {
        return res.status(401).json({
            mesaage: "Invalid Email or Password"
        })
    }

    let decode = await bcrypt.compare(password, student.password);
    if (!decode) {
        return res.status(401).json({
            mesaage: "Invalid Email or Password"
        })
    }

    let token = jwt.sign({ id: student._id, email: student.email, role: student.role }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(200).json({
        message: "Login Successfully",
        student
    })

}

module.exports = { registerStudent, loginStudent }