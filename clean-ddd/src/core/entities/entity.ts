import { UniqueEntityID } from "./unique-entity-id.js";

export abstract class Entify<Props> {
    private _id: UniqueEntityID
    protected props: Props

    get id() {
        return this._id
    }

    protected constructor(props: Props, id?: UniqueEntityID) {
        this.props = props
        this._id = id ?? new UniqueEntityID()
    }
}