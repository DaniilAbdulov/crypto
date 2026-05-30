import * as usersRepository from '../repositories/users.repository';

export async function getUserById(id: string) {
  const user = await usersRepository.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
