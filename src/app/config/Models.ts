import { Model, Sequelize } from 'sequelize';
import { User } from '../models/User.model';

export class Models {
    protected models = [User];

    public create(dbContext: Sequelize) {
        return this.models.map((m) => {
            return {
                [m.modelName]: m.buildModel(dbContext),
            };
        });
    }

    public associate(modelMap: Record<string, any>) {
        for (const model of Object.values(modelMap)) {
            if (model?.associate) {
                model.associate(modelMap);
            }
        }
    }
}
