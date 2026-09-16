import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommitteesService } from './committees/committees.service';
import { BoardService } from './board/board.service';
import { CommitteeMembersService } from './committees/committee-members.service';
import { CommitteeMemberRole } from './committees/entities/committee-member.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const committeesService = app.get(CommitteesService);
  const committeeMembersService = app.get(CommitteeMembersService);
  const boardService = app.get(BoardService);

  console.log('Seeding Categories...');
  const techCat = await committeesService.createCategory({ name: 'Technical', description: 'Technical Committees' });
  const adminCat = await committeesService.createCategory({ name: 'Administrative', description: 'Administrative Committees' });

  console.log('Seeding Committees...');
  const ras = await committeesService.createCommittee({ 
    name: 'RAS', 
    description: 'Robotics and Automation Society', 
    category_id: techCat.id 
  });
  
  const cs = await committeesService.createCommittee({ 
    name: 'CS', 
    description: 'Computer Society', 
    category_id: techCat.id 
  });
  
  const hr = await committeesService.createCommittee({ 
    name: 'HR', 
    description: 'Human Resources', 
    category_id: adminCat.id 
  });

  console.log('Seeding Committee Members (Leaders)...');
  await committeeMembersService.createCommitteeMember({
    committee_id: ras.id,
    name: 'Ahmed Robotics',
    email: 'ahmed@ieee.org',
    role: CommitteeMemberRole.HEAD,
  });

  await committeeMembersService.createCommitteeMember({
    committee_id: cs.id,
    name: 'Sarah Code',
    email: 'sarah@ieee.org',
    role: CommitteeMemberRole.HEAD,
  });
  
  await committeeMembersService.createCommitteeMember({
    committee_id: cs.id,
    name: 'Ali Python',
    email: 'ali@ieee.org',
    role: CommitteeMemberRole.MEMBER,
  });

  await committeeMembersService.createCommitteeMember({
    committee_id: hr.id,
    name: 'Mariam People',
    email: 'mariam@ieee.org',
    role: CommitteeMemberRole.HEAD,
  });

  console.log('Seeding High Board Members...');
  await boardService.createBoardMember({
    name: 'Youssef Chairman',
    email: 'chairman@ieee.org',
    role: 'Chairman',
    display_order: 1,
  });

  await boardService.createBoardMember({
    name: 'Nour Vice Chair',
    email: 'vicechair@ieee.org',
    role: 'Vice Chairman',
    display_order: 2,
  });

  console.log('Seeding complete!');
  await app.close();
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
