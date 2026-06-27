const fs = require('fs');
const path = require('path');
const model = require("../models/index");
const messages = require("./message");
const koneksi = require("../config/database");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectEmployee = async function (req, res) {
  try {
    const language = req.body.language_POST;
    const selectEmployeeData = await model.adm_employee.findAll({
      attributes: ["employee_id", "fullname"],
      order: [
        ['fullname', 'ASC'],
      ],
    });
    if (selectEmployeeData.length > 0) {
      return responseHelper.success(res, "employee data", selectEmployeeData);
    } else {
      return responseHelper.success(res, messages[language]?.nodata || "Tidak ada data", []);
    }
  } catch (error) {
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.selectEmployeeByType = async function (req, res) {
  try {
    const language = req.body.language_POST;
    const tipe = req.body.companyType_POST;
    const companyCode = req.body.companyCode_POST;
    const companyParent = req.body.companyParent_POST;

    let location;
    if (tipe === "Head") {
      location = { code_company: companyParent };
    } else {
      location = {
        worksite: {
          [Op.like]: companyCode + "%"
        }
      };
    }
    const selectEmployeeByTypeData = await model.hrd_employee.findAll({
      include: [
        {
          model: model.hrd_department,
          attributes: ["department_code"],
          include: {
            model: model.hrd_department_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_job_title,
          attributes: ["id_job_title"],
          include: {
            model: model.hrd_job_title_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.adm_company,
          attributes: ["name"],
        },
        {
          model: model.adm_company,
          as: "WorksiteCompany",
          attributes: ["name"],
        },
        {
          model: model.hrd_catu,
          attributes: ["catu_code"],
          include: {
            model: model.hrd_catu_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_education,
          attributes: ["code_education"],
          include: {
            model: model.hrd_education_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_type,
          attributes: ["employee_type_code"],
          include: {
            model: model.hrd_employee_type_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_religion,
          attributes: ["code_religion"],
          include: {
            model: model.hrd_religion_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_status,
          attributes: ["code_employee_status"],
          include: {
            model: model.hrd_employee_status_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_tax,
          attributes: ["employee_tax_code"],
          include: {
            model: model.hrd_employee_tax_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_grade,
          attributes: ["grade_code"],
          include: {
            model: model.hrd_grade_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_marital,
          attributes: ["marital_code"],
          include: {
            model: model.hrd_employee_marital_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_gender,
          attributes: ["gender_code"],
          include: {
            model: model.hrd_gender_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_salary,
          attributes: ["employee_salary_code"],
          include: {
            model: model.hrd_employee_salary_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
      ],
      where: location,
      order: [
        ['fullname', 'ASC'],
      ],
    });
    if (selectEmployeeByTypeData.length > 0) {
      return responseHelper.success(res, "employee data", selectEmployeeByTypeData);
    } else {
      return responseHelper.Unsuccessful(res, messages[language]?.nodata, []);
    }
  } catch (error) {
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.selectEmployeeByWorksite = async function (req, res) {
  try {
    const language = req.body.language_POST;
    const tipe = req.body.companyType_POST;
    const companyCode = req.body.companyCode_POST;
    const companyParent = req.body.companyParent_POST;

    let location;
    if (tipe === "Head") {
      location = { worksite: companyCode };
    } else {
      location = {
        worksite: {
          [Op.like]: companyCode + "%"
        }
      };
    }
    const selectEmployeeByTypeData = await model.hrd_employee.findAll({
      include: [
        {
          model: model.adm_company,
          attributes: ["name"],
        },
        {
          model: model.adm_company,
          as: "WorksiteCompany",
          attributes: ["name"],
        },
      ],
      where: location,
      order: [
        ['fullname', 'ASC'],
      ],
    });
    if (selectEmployeeByTypeData.length > 0) {
      return responseHelper.success(res, "employee data", selectEmployeeByTypeData);
    } else {
      return responseHelper.Unsuccessful(res, messages[language]?.nodata || "Tidak ada data", []);
    }
  } catch (error) {
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.insertEmployee = async function (req, res) {
  const transaction = await koneksi.transaction();
  try {
    const jsonData = JSON.parse(req.body.data);

    const language = jsonData["language_POST"];
    const username = jsonData["username_POST"];
    const identityNumber = jsonData["identityNumber_POST"];
    const fullname = jsonData["fullname_POST"];
    const gender = jsonData["gender_POST"];
    const dateBirth = jsonData["dateBirth_POST"];
    const placeBirth = jsonData["placeBirth_POST"];
    const address = jsonData["address_POST"];
    const city = jsonData["city_POST"];
    const zipCode = jsonData["zipCode_POST"];
    const province = jsonData["province_POST"];
    const nationality = jsonData["nationality_POST"];
    const department = jsonData["department_POST"];
    const jobTitle = jsonData["jobTitle_POST"];
    const tax = jsonData["tax_POST"];
    const company = jsonData["company_POST"];
    const employeeType = jsonData["employeeType_POST"];
    const employeeStatus = jsonData["employeeStatus_POST"];
    const grade = jsonData["grade_POST"];
    const dateJoining = jsonData["dateJoining_POST"];
    const dateAppoimen = jsonData["dateAppoimen_POST"];
    const worksite = jsonData["worksite_POST"];
    const receptionLocation = jsonData["receptionLocation_POST"];
    const ration = jsonData["ration_POST"];
    const noTelepon = jsonData["noTelepon_POST"];
    const noHandphone = jsonData["noHandphone_POST"];
    const personalEmail = jsonData["personalEmail_POST"];
    const businessEmail = jsonData["businessEmail_POST"];
    const emergencyNumber = jsonData["emergencyNumber_POST"];
    const taxStatus = jsonData["taxStatus_POST"];
    const bankNumber = jsonData["bankNumber_POST"];
    const bank = jsonData["bank_POST"];
    const salarySystem = jsonData["salarySystem_POST"];
    const marital = jsonData["marital_POST"];
    const weddingDate = jsonData["weddingDate_POST"];
    const childrenNumber = jsonData["childrenNumber_POST"];
    const dependentsNumber = jsonData["dependentsNumber_POST"];
    const familyNumber = jsonData["familyNumber_POST"];
    const noPassport = jsonData["noPassport_POST"];
    const healthInsuranceNumber = jsonData["healthInsuranceNumber"];
    const employmentInsurancePurposes = jsonData["employmentInsurancePurposes_POST"];
    const driversLicenseNumber = jsonData["driversLicenseNumber_POST"];
    const religion = jsonData["religion_POST"];
    const bloodType = jsonData["bloodType_POST"];
    const education = jsonData["education_POST"];

    const selectEmployeeCodeData = await model.adm_company_employee_code.findAll({
      where: {
        code_company: company
      },
      transaction
    });

    if (!selectEmployeeCodeData || selectEmployeeCodeData.length === 0) {
      await transaction.rollback();
      return responseHelper.Unsuccessful(res, messages[language]?.nodata, []);
    }

    const employeeCode = selectEmployeeCodeData[0]["employee_code"];
    const splitDate = dateJoining.split('-');
    const nikbulan = splitDate[0] + splitDate[1];
    const substring = nikbulan.substring(2, 6);
    const idsubstring = substring + employeeCode;

    const selectEmployeeIDData = await model.hrd_employee.findAll({
      attributes: ['employee_id'],
      where: Sequelize.where(
        Sequelize.cast(Sequelize.col('employee_id'), 'TEXT'),
        {
          [Op.like]: idsubstring + "%"
        }
      ),
      transaction
    });

    let NikEmployee;
    if (selectEmployeeIDData.length > 0) {
      const idsubstringEmployeePush = [];
      for (let i = 0; i < selectEmployeeIDData.length; i++) {
        const idsubstringEmployee = JSON.parse(selectEmployeeIDData[i]['employee_id']);
        idsubstringEmployeePush.push(idsubstringEmployee);
      }
      const idsubstringEmployeeMax = Math.max.apply(null, idsubstringEmployeePush);
      const substringNik = idsubstringEmployeeMax.toString();
      const endsubstringNik = substringNik.substring(6, 9);
      const startsubstringNik = substringNik.substring(0, 6);
      const endsubstringNikEmployee = parseInt(endsubstringNik) + 1;
      const noUrut = (endsubstringNikEmployee.toString()).padStart(3, "0");
      const stratsubstringNikEmployee = parseInt(startsubstringNik);
      NikEmployee = stratsubstringNikEmployee + "" + noUrut;
    } else {
      const no = "1";
      const noUrut = no.padStart(3, "0");
      NikEmployee = idsubstring + noUrut;
    }

    let namaPhoto;
    if (req.file) {
      const photoFile = req.file;
      const fileExtension = path.extname(photoFile.originalname);
      const newFileName = `${NikEmployee}${fileExtension}`;
      const oldFilePath = path.join(__dirname, '../assets/image/employee/', photoFile.filename);
      const newFilePath = path.join(__dirname, '../assets/image/employee/', newFileName);
      fs.renameSync(oldFilePath, newFilePath);
      namaPhoto = newFileName;
    } else {
      namaPhoto = "employee.png";
    }

    const insertEmployeeNewData = await model.hrd_employee.create(
      {
        employee_id: NikEmployee,
        department_code: department,
        code_company: company,
        code_education: education,
        id_job_title: jobTitle,
        employee_type_code: employeeType,
        catu_code: ration,
        code_religion: religion,
        code_employee_status: employeeStatus,
        employee_tax_code: taxStatus,
        grade_code: grade,
        marital_code: marital,
        fullname: fullname,
        place_of_birth: placeBirth,
        date_of_birth: dateBirth,
        nationality: nationality,
        wedding_date: weddingDate,
        blood_type: bloodType,
        address: address,
        province: province,
        city: city,
        zip_code: zipCode,
        no_telepon: noTelepon,
        mobile_number: noHandphone,
        bank_account_number: bankNumber,
        bank: bank,
        passport_number: noPassport,
        family_card_number: familyNumber,
        identity_card_number: identityNumber,
        emergency_contact_number: emergencyNumber,
        date_of_joining: dateJoining,
        date_of_appointment: dateAppoimen,
        date_of_exit: null,
        number_of_children: childrenNumber,
        number_of_dependents: dependentsNumber,
        tax_identification_number: tax,
        health_insurance_number: healthInsuranceNumber,
        reception_location: receptionLocation,
        personal_email: personalEmail,
        business_email: businessEmail,
        worksite: worksite,
        employment_insurance_purposes: employmentInsurancePurposes,
        drivers_license_number: driversLicenseNumber,
        photo: namaPhoto,
        gender_code: gender,
        employee_salary_code: salarySystem,
      },
      {
        transaction
      },
    );

    if (insertEmployeeNewData) {
      await transaction.commit();
      logger.info('Insert Employee', {
        "1.username": `${username}`,
        "2.module": 'insertEmployee',
        "3.status": 'success',
        "4.action": req.body
      });
      return responseHelper.success(res, messages[language]?.insertData, insertEmployeeNewData);
    } else {
      await transaction.rollback();
      return responseHelper.Unsuccessful(res, messages[language]?.nodata, []);
    }
  } catch (error) {
    await transaction.rollback();
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.selectEmployeeByID = async function (req, res) {
  const transaction = await koneksi.transaction();
  try {
    const language = req.body.language_POST;
    const employeeID = req.body.employeeCode_POST;
    const selectEmployeeData = await model.hrd_employee.findAll({
      include: [
        {
          model: model.hrd_department,
          attributes: ["department_code"],
          include: {
            model: model.hrd_department_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            }
          }
        },
        {
          model: model.hrd_job_title,
          attributes: ["id_job_title"],
          include: {
            model: model.hrd_job_title_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.adm_company,
          attributes: ["name"],
        },
        {
          model: model.hrd_catu,
          attributes: ["catu_code"],
          include: {
            model: model.hrd_catu_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_education,
          attributes: ["code_education"],
          include: {
            model: model.hrd_education_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_type,
          attributes: ["employee_type_code"],
          include: {
            model: model.hrd_employee_type_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_religion,
          attributes: ["code_religion"],
          include: {
            model: model.hrd_religion_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_status,
          attributes: ["code_employee_status"],
          include: {
            model: model.hrd_employee_status_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_tax,
          attributes: ["employee_tax_code"],
          include: {
            model: model.hrd_employee_tax_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_grade,
          attributes: ["grade_code"],
          include: {
            model: model.hrd_grade_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_marital,
          attributes: ["marital_code"],
          include: {
            model: model.hrd_employee_marital_translations,
            where: {
              language_code: language
            },
          },
        },
        {
          model: model.hrd_employee_salary,
          attributes: ["employee_salary_code"],
          include: {
            model: model.hrd_employee_salary_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_gender,
          attributes: ["gender_code"],
          include: {
            model: model.hrd_gender_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
      ],
      where: {
        employee_id: employeeID
      },
      transaction
    });
    if (selectEmployeeData.length > 0) {
      await transaction.commit();
      return responseHelper.success(res, "employee data", selectEmployeeData);
    } else {
      await transaction.rollback();
      return responseHelper.success(res, messages[language]?.nodata || "Tidak ada data", []);
    }
  } catch (error) {
    await transaction.rollback();
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.updateEmployee = async function (req, res) {
  const transaction = await koneksi.transaction();
  try {
    const jsonData = JSON.parse(req.body.data);
    const id = req.params.id;
    const language = jsonData["language_POST"];
    const username = jsonData["username_POST"];
    const identityNumber = jsonData["identityNumber_POST"];
    const fullname = jsonData["fullname_POST"];
    const gender = jsonData["gender_POST"];
    const dateBirth = jsonData["dateBirth_POST"];
    const placeBirth = jsonData["placeBirth_POST"];
    const address = jsonData["address_POST"];
    const city = jsonData["city_POST"];
    const zipCode = jsonData["zipCode_POST"];
    const province = jsonData["province_POST"];
    const nationality = jsonData["nationality_POST"];
    const department = jsonData["department_POST"];
    const jobTitle = jsonData["jobTitle_POST"];
    const tax = jsonData["tax_POST"];
    const company = jsonData["company_POST"];
    const employeeType = jsonData["employeeType_POST"];
    const employeeStatus = jsonData["employeeStatus_POST"];
    const grade = jsonData["grade_POST"];
    const dateJoining = jsonData["dateJoining_POST"];
    const dateAppoimen = jsonData["dateAppoimen_POST"];
    const dateExit = jsonData["dateExit_POST"];
    const worksite = jsonData["worksite_POST"];
    const receptionLocation = jsonData["receptionLocation_POST"];
    const ration = jsonData["ration_POST"];
    const noTelepon = jsonData["noTelepon_POST"];
    const noHandphone = jsonData["noHandphone_POST"];
    const personalEmail = jsonData["personalEmail_POST"];
    const businessEmail = jsonData["businessEmail_POST"];
    const emergencyNumber = jsonData["emergencyNumber_POST"];
    const taxStatus = jsonData["taxStatus_POST"];
    const bankNumber = jsonData["bankNumber_POST"];
    const bank = jsonData["bank_POST"];
    const salarySystem = jsonData["salarySystem_POST"];
    const marital = jsonData["marital_POST"];
    const weddingDate = jsonData["weddingDate_POST"];
    const childrenNumber = jsonData["childrenNumber_POST"];
    const dependentsNumber = jsonData["dependentsNumber_POST"];
    const familyNumber = jsonData["familyNumber_POST"];
    const noPassport = jsonData["noPassport_POST"];
    const healthInsuranceNumber = jsonData["healthInsuranceNumber_POST"];
    const employmentInsurancePurposes = jsonData["employmentInsurancePurposes_POST"];
    const driversLicenseNumber = jsonData["driversLicenseNumber_POST"];
    const religion = jsonData["religion_POST"];
    const bloodType = jsonData["bloodType_POST"];
    const education = jsonData["education_POST"];

    let namaPhoto;
    if (req.file) {
      const photoFile = req.file;
      const fileExtension = path.extname(photoFile.originalname);
      const newFileName = `${id}${fileExtension}`;
      const oldFilePath = path.join(__dirname, '../assets/image/employee/', photoFile.filename);
      const newFilePath = path.join(__dirname, '../assets/image/employee/', newFileName);
      fs.renameSync(oldFilePath, newFilePath);
      namaPhoto = newFileName;
    } else {
      const selectEmployeeData = await model.hrd_employee.findAll({
        where: {
          employee_id: id
        },
        transaction
      });
      if (selectEmployeeData.length > 0) {
        namaPhoto = selectEmployeeData[0]["photo"];
      } else {
        await transaction.rollback();
        return responseHelper.Unsuccessful(res, messages[language]?.userAccess);
      }
    }

    const updateEmployeeData = await model.hrd_employee.update(
      {
        department_code: department,
        code_company: company,
        code_education: education,
        id_job_title: jobTitle,
        employee_type_code: employeeType,
        catu_code: ration,
        code_religion: religion,
        code_employee_status: employeeStatus,
        employee_tax_code: taxStatus,
        grade_code: grade,
        marital_code: marital,
        fullname: fullname,
        place_of_birth: placeBirth,
        date_of_birth: dateBirth,
        nationality: nationality,
        wedding_date: weddingDate,
        blood_type: bloodType,
        address: address,
        province: province,
        city: city,
        zip_code: zipCode,
        no_telepon: noTelepon,
        mobile_number: noHandphone,
        bank_account_number: bankNumber,
        bank: bank,
        passport_number: noPassport,
        family_card_number: familyNumber,
        identity_card_number: identityNumber,
        emergency_contact_number: emergencyNumber,
        date_of_joining: dateJoining,
        date_of_appointment: dateAppoimen,
        date_of_exit: dateExit,
        number_of_children: childrenNumber,
        number_of_dependents: dependentsNumber,
        tax_identification_number: tax,
        health_insurance_number: healthInsuranceNumber,
        reception_location: receptionLocation,
        personal_email: personalEmail,
        business_email: businessEmail,
        worksite: worksite,
        employment_insurance_purposes: employmentInsurancePurposes,
        drivers_license_number: driversLicenseNumber,
        photo: namaPhoto,
        gender_code: gender,
        employee_salary_code: salarySystem,
      },
      {
        where: {
          employee_id: id
        },
        transaction
      },
    );

    if (updateEmployeeData) {
      await transaction.commit();
      logger.info('Update Employee', {
        "1.username": `${username}`,
        "2.module": 'updateEmployee',
        "3.status": 'success',
        "4.action": req.body
      });
      return responseHelper.success(res, messages[language]?.updateData, updateEmployeeData);
    } else {
      await transaction.rollback();
      return responseHelper.Unsuccessful(res, messages[language]?.nodata, []);
    }
  } catch (error) {
    await transaction.rollback();
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.selectEmployeeByPUR = async function (req, res) {
  try {
    const language = req.body.language_POST;
    const selectEmployeeData = await model.hrd_employee.findAll({
      attributes: ["employee_id", "fullname", "code_company"],
      where: {
        [Op.and]: [
          { date_of_exit: null },
          { department_code: "PUR" },
        ]
      },
      order: [
        ['fullname', 'ASC'],
      ],
    });
    if (selectEmployeeData.length > 0) {
      return responseHelper.success(res, "employee data", selectEmployeeData);
    } else {
      return responseHelper.success(res, messages[language]?.nodata || "Tidak ada data", []);
    }
  } catch (error) {
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.selectEmployeeByGI = async function (req, res) {
  try {
    const language = req.body.language_POST;
    const worksite = req.body.worksite_POST;
    const selectEmployeeData = await model.hrd_employee.findAll({
      attributes: ["employee_id", "fullname", "code_company"],
      where: {
        [Op.and]: [
          { date_of_exit: null },
          { worksite: worksite },
        ]
      },
      order: [
        ['fullname', 'ASC'],
      ],
    });
    if (selectEmployeeData.length > 0) {
      return responseHelper.success(res, "employee data", selectEmployeeData);
    } else {
      return responseHelper.success(res, messages[language]?.nodata || "Tidak ada data", []);
    }
  } catch (error) {
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.selectEmployeeByBasicSalary = async function (req, res) {
  try {
    const requestData = req.body;
    const {
      language_POST: language,
      location_POST: location,
      employee_type_POST: employeeType,
      period_date_POST: periodDate,
    } = requestData;

    const selectEmployeeData = await model.hrd_employee.findAll({
      attributes: ["employee_id", "fullname", "employee_type_code", "id_job_title"],
      include: [
        {
          model: model.hrd_job_title,
          attributes: ["id_job_title"],
          include: {
            model: model.hrd_job_title_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
        {
          model: model.hrd_employee_type,
          attributes: ["employee_type_code"],
          include: {
            model: model.hrd_employee_type_translations,
            attributes: ["language_code", "translation"],
            where: {
              language_code: language
            },
          }
        },
      ],
      where: {
        [Op.and]: [
          {
            employee_type_code: employeeType
          },
          {
            worksite: { [Op.like]: `${location}%` }
          },
          {
            date_of_exit: null
          }
        ]
      },
      order: [
        ["fullname", "ASC"]
      ]
    });

    if (selectEmployeeData.length === 0) {
      return responseHelper.Unsuccessful(res, messages[language]?.nodata);
    }

    return responseHelper.success(res, messages[language]?.successfulData, selectEmployeeData);
  } catch (error) {
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

controller.selectEmployeeByHaverst = async function (req, res) {
  try {
    const language = req.body.language_POST;
    const companyCode = req.body.location_POST;
    const selectEmployeeByTypeData = await model.hrd_employee.findAll({
      include: [
        {
          model: model.adm_company,
          attributes: ["name"],
        },
        {
          model: model.adm_company,
          as: "WorksiteCompany",
          attributes: ["name"],
        },
      ],
      where: {
        [Op.and]: [
          {
            worksite: {
              [Op.like]: companyCode + "%"
            }
          },
          {
            date_of_exit: null
          },
          {
            employee_type_code: { [Op.in]: [1, 2, 3, 4] }
          },
        ]
      },
      order: [
        ['fullname', 'ASC'],
      ],
    });
    if (selectEmployeeByTypeData.length > 0) {
      return responseHelper.success(res, "employee data", selectEmployeeByTypeData);
    } else {
      return responseHelper.Unsuccessful(res, messages[language]?.nodata || "Tidak ada data", []);
    }
  } catch (error) {
    return responseHelper.error(res, error, "Terjadi kesalahan pada server");
  }
};

module.exports = controller;