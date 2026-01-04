import bcrypt from "bcrypt";
import Member from "../models/Member.js";

export default class AuthController {

    async register(req, res) {
        try {
            const memberData = this.#extractMemberData(req.body);

            if (await this.#memberExists(memberData.email)) {
                return this.#renderRegisterError(res, "Email already exists");
            }

            memberData.password = await this.#hashPassword(memberData.password);

            await this.#createMember(memberData);

            return this.#renderLoginSuccess(res);

        } catch (err) {
            console.error(err);
            return this.#renderRegisterError(res, "Something went wrong");
        }
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

    #renderRegisterError(res, message) {
        return res.render("register", { error: message });
    }

    #renderLoginSuccess(res) {
        return res.render("login", {
            success: "Account created successfully"
        });
    }
}
