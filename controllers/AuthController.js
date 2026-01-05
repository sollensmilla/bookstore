import bcrypt from "bcrypt";
import Member from "../models/Member.js";

export default class AuthController {

    async register(req, res) {
        try {
            const memberData = this.#extractMemberData(req.body);

            if (await this.#memberExists(memberData.email)) {
                return this.#renderRegisterError(
                    res,
                    "Email already in use",
                    memberData
                );
            }

            memberData.password = await this.#hashPassword(memberData.password);

            const member = await this.#createMember(memberData);

            this.#createSession(req, member);

            req.session.flash = {
                type: "success",
                message: "Account created successfully"
            };

            return res.redirect("/logged-in");

        } catch (err) {
            console.error(err);
            return this.#renderRegisterError(res, "Something went wrong");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        const member = await Member.findByEmail(email);
        if (!member) {
            return res.render("login", { error: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, member.password);
        if (!valid) {
            return res.render("login", { error: "Invalid credentials" });
        }

        this.#createSession(req, member);

        return res.redirect("/logged-in");
    }

    #extractMemberData(body) {
        const {
            firstName,
            lastName,
            address,
            city,
            zip,
            phone,
            email,
            password
        } = body;

        return { firstName, lastName, address, city, zip, phone, email, password };
    }

    async #memberExists(email) {
        const member = await Member.findByEmail(email);
        return !!member;
    }

    async #hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    async #createMember(memberData) {
        const member = new Member(memberData);
        return member.save();
    }

    #renderRegisterError(res, message, formData = {}) {
        return res.render("register", {
            error: message,
            formData
        });
    }

    #createSession(req, member) {
        req.session.member = {
            id: member.id,
            fname: member.fname,
            lname: member.lname,
            email: member.email
        };
    }
}
