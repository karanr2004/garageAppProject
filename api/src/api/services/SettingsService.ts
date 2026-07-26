import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GarageSetting } from '../models/GarageSetting';
import { getDataSource } from '../utils/dataSource';

@Service()
export class SettingsService {
  private get repo(): Repository<GarageSetting> {
    return getDataSource().getRepository(GarageSetting);
  }

  public async get(): Promise<GarageSetting> {
    let settings = await this.repo.findOne({ where: {} });
    if (!settings) {
      settings = await this.repo.save(
        this.repo.create({
          garageName: 'S G BABU AUTO GARAGE',
          location: 'Thiruvannamalai',
          phone: '98765 43210',
        })
      );
    }
    return settings;
  }

  public async update(data: Partial<GarageSetting>): Promise<GarageSetting> {
    const settings = await this.get();
    Object.assign(settings, {
      garageName: data.garageName ?? settings.garageName,
      location: data.location ?? settings.location,
      phone: data.phone ?? settings.phone,
    });
    return this.repo.save(settings);
  }
}
