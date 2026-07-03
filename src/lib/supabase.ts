import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isMock =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('your-project') ||
  supabaseAnonKey.includes('your-anon-key')

class MockQuery {
  private table: string
  private filters: Array<{ type: 'eq' | 'in'; col: string; val: any }> = []
  private orderCol: string | null = null
  private action: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select'
  private actionData: any = null
  private isSingle = false
  private isMaybeSingle = false

  constructor(table: string) {
    this.table = table
  }

  select(_columns?: string) {
    return this
  }

  eq(col: string, val: any) {
    this.filters.push({ type: 'eq', col, val })
    return this
  }

  in(col: string, val: any[]) {
    this.filters.push({ type: 'in', col, val })
    return this
  }

  order(col: string) {
    this.orderCol = col
    return this
  }

  insert(data: any) {
    this.action = 'insert'
    this.actionData = data
    return this
  }

  update(data: any) {
    this.action = 'update'
    this.actionData = data
    return this
  }

  delete() {
    this.action = 'delete'
    return this
  }

  upsert(data: any) {
    this.action = 'upsert'
    this.actionData = data
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  maybeSingle() {
    this.isMaybeSingle = true
    return this
  }

  private execute() {
    const dbStr = localStorage.getItem('support_teacher_mock_db')
    let db: any = dbStr ? JSON.parse(dbStr) : null
    if (db && db.students && db.students.length <= 5) {
      db = null
    }
    if (!db) {
      db = {
        groups: [
              {
                      "id": "g1",
                      "name": "A6",
                      "status": "active"
              },
              {
                      "id": "g2",
                      "name": "A7",
                      "status": "active"
              },
              {
                      "id": "g3",
                      "name": "A9",
                      "status": "active"
              },
              {
                      "id": "g4",
                      "name": "A10",
                      "status": "active"
              },
              {
                      "id": "g5",
                      "name": "A12",
                      "status": "active"
              },
              {
                      "id": "g6",
                      "name": "B1",
                      "status": "active"
              },
              {
                      "id": "g7",
                      "name": "B2",
                      "status": "active"
              },
              {
                      "id": "g8",
                      "name": "B3",
                      "status": "active"
              },
              {
                      "id": "g9",
                      "name": "A13",
                      "status": "active"
              },
              {
                      "id": "g10",
                      "name": "A14",
                      "status": "active"
              },
              {
                      "id": "g11",
                      "name": "A15",
                      "status": "active"
              },
              {
                      "id": "g12",
                      "name": "A16",
                      "status": "active"
              },
              {
                      "id": "g13",
                      "name": "B8",
                      "status": "active"
              },
              {
                      "id": "g14",
                      "name": "B9",
                      "status": "active"
              }
      ],
        students: [
              {
                      "id": "s1",
                      "full_name": "Alimov Husniddin",
                      "group_id": "g1",
                      "status": "active"
              },
              {
                      "id": "s2",
                      "full_name": "Samadov Muhammad",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s3",
                      "full_name": "Bahriddinov Mehriddin",
                      "group_id": "g1",
                      "status": "active"
              },
              {
                      "id": "s4",
                      "full_name": "Jo’ramurodov Bahodir",
                      "group_id": "g1",
                      "status": "active"
              },
              {
                      "id": "s5",
                      "full_name": "Amirov Amirxon",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s6",
                      "full_name": "Eshonqulov Abdulaziz",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s7",
                      "full_name": "Davronov Salohiddin",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s8",
                      "full_name": "Odiljonov Nurshod",
                      "group_id": "g1",
                      "status": "active"
              },
              {
                      "id": "s9",
                      "full_name": "Nasrullayev Muhammadsaid",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s10",
                      "full_name": "Burxonov Bobir",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s11",
                      "full_name": "Marupov Abduaziz",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s12",
                      "full_name": "Hamroqulov Hojiakbar",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s13",
                      "full_name": "To'raqulov Zohidjon",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s14",
                      "full_name": "Ma'rufov Ahmad",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s15",
                      "full_name": "Hasanov Asilbek",
                      "group_id": "g1",
                      "status": "active"
              },
              {
                      "id": "s16",
                      "full_name": "Ashrabov Ahmadjon",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s17",
                      "full_name": "Kamoljonov Doniyorbek",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s18",
                      "full_name": "Jabborova Mohlaroyim",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s19",
                      "full_name": "Karimov Abdulloh",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s20",
                      "full_name": "Izzatullayev Muhammadziyo",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s21",
                      "full_name": "Nuriddinov Kamoliddin",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s22",
                      "full_name": "Qurbonov Saidshox",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s23",
                      "full_name": "Raximov Abduraxmon",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s24",
                      "full_name": "Eshonqulov Alisher",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s25",
                      "full_name": "Sheraliyev Bexruz",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s26",
                      "full_name": "Maxmudov Samirbek",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s27",
                      "full_name": "Majidova Shabnam",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s28",
                      "full_name": "G'anixonov Muhammadxoji",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s29",
                      "full_name": "Baxriddinov Zuxriddin",
                      "group_id": "g3",
                      "status": "active"
              },
              {
                      "id": "s30",
                      "full_name": "Xazratqulov Shoxrux",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s31",
                      "full_name": "Raxmonov Islom",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s32",
                      "full_name": "Abdumajidov Ahmadjon",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s33",
                      "full_name": "Islomov Ibrohim",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s34",
                      "full_name": "Sultonmurodov Muhammadsolih",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s35",
                      "full_name": "Olimov Jafarxon",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s36",
                      "full_name": "Solihov Abdulloh",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s37",
                      "full_name": "Haydarov Hamidulloh",
                      "group_id": "g4",
                      "status": "active"
              },
              {
                      "id": "s38",
                      "full_name": "Fazliyev Najmiddin",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s39",
                      "full_name": "Ibrohimova Zulfiya",
                      "group_id": "g13",
                      "status": "active"
              },
              {
                      "id": "s40",
                      "full_name": "Abdugafurov Yusufjon",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s41",
                      "full_name": "Xurramov G'olibjon",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s42",
                      "full_name": "Amonova Sevinchbonu",
                      "group_id": "g13",
                      "status": "active"
              },
              {
                      "id": "s43",
                      "full_name": "G'aniyev Oyatillo",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s44",
                      "full_name": "O'tkirov Muhammadali",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s45",
                      "full_name": "Tilakov Jaloliddin",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s46",
                      "full_name": "Negmatullayev Ibodullo",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s47",
                      "full_name": "Islomov Xusan",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s48",
                      "full_name": "Nematov Mirzobek",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s49",
                      "full_name": "Davronov Bobur",
                      "group_id": "g5",
                      "status": "active"
              },
              {
                      "id": "s50",
                      "full_name": "Alisherova Maknuna",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s51",
                      "full_name": "Mahqulov Mirzohid",
                      "group_id": "g13",
                      "status": "active"
              },
              {
                      "id": "s52",
                      "full_name": "Zayniddinov Shexroz",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s53",
                      "full_name": "Rustamov Abubakr",
                      "group_id": "g13",
                      "status": "active"
              },
              {
                      "id": "s54",
                      "full_name": "Amriddinov Najmiddin",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s55",
                      "full_name": "Sirojiddinov Shohrux",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s56",
                      "full_name": "Sirojiddinov Shaxzod",
                      "group_id": "g9",
                      "status": "active"
              },
              {
                      "id": "s57",
                      "full_name": "Soliyev Sardor",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s58",
                      "full_name": "Zoxidov Sheroz",
                      "group_id": "g13",
                      "status": "active"
              },
              {
                      "id": "s59",
                      "full_name": "Burxonov Bexruz",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s60",
                      "full_name": "Saidmurodov Shoxjahon",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s61",
                      "full_name": "Ashurov Abdug'affor",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s62",
                      "full_name": "Ortiqov Bexruz",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s63",
                      "full_name": "O'ktamov Javoxir",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s64",
                      "full_name": "Islomova Bibisora",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s65",
                      "full_name": "Egamberdiyev Muhammad",
                      "group_id": "g13",
                      "status": "active"
              },
              {
                      "id": "s66",
                      "full_name": "Shukrullayev Ozodbek",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s67",
                      "full_name": "Muxsinov Javohir",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s68",
                      "full_name": "Salomov Xurshid",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s69",
                      "full_name": "Erkinov Muhammadjon",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s70",
                      "full_name": "Toxirov Matniyoz",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s71",
                      "full_name": "Narzullayev Dilshod",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s72",
                      "full_name": "Bahodirov Yusuf",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s73",
                      "full_name": "Bahodirov Yusuf",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s74",
                      "full_name": "Tolibov Amin",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s75",
                      "full_name": "Maxkamova Gulsanam",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s76",
                      "full_name": "Nasimov Sardor",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s77",
                      "full_name": "Norqulov Suxrobbek",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s78",
                      "full_name": "Dosmurodov Ismoil",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s79",
                      "full_name": "Ochilov Muhammadraxim",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s80",
                      "full_name": "Maqsadillayev Muslim",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s81",
                      "full_name": "To'lqinov Abduqodir",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s82",
                      "full_name": "Mavlonov Fazliddin",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s83",
                      "full_name": "Sirojiddinov Jahongir",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s84",
                      "full_name": "Sodiqov Elnur",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s85",
                      "full_name": "Matlabov Azizbek",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s86",
                      "full_name": "Matlobov Xikmat",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s87",
                      "full_name": "Marotov Akobir",
                      "group_id": "g14",
                      "status": "active"
              },
              {
                      "id": "s88",
                      "full_name": "Akbarov Ismoil",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s89",
                      "full_name": "Ulug'bekov Amir",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s90",
                      "full_name": "Jabbarov Abdukarim",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s91",
                      "full_name": "Qahorov Usmon",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s92",
                      "full_name": "Rustamov Xurshid",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s93",
                      "full_name": "Barotov Firdavs",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s94",
                      "full_name": "Baxrullayev Xushnud",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s95",
                      "full_name": "Narzullayev Jahongir",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s96",
                      "full_name": "Karimov Muhammadyusuf",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s97",
                      "full_name": "Solixjonov Javoxir",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s98",
                      "full_name": "Matlabov Kamron",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s99",
                      "full_name": "Hakimov Islom",
                      "group_id": "g11",
                      "status": "active"
              },
              {
                      "id": "s100",
                      "full_name": "Muradillayev Ramziddin",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s101",
                      "full_name": "Sattorov Mironshox",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s102",
                      "full_name": "Kamolov Muhammadsodiq",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s103",
                      "full_name": "Rajabqulov Zahriddin",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s104",
                      "full_name": "Ashrabov Islom",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s105",
                      "full_name": "Voxobov Muhammadali",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s106",
                      "full_name": "Sadriddinov Sabriddin",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s107",
                      "full_name": "Mahmatqulov Muhammadamin",
                      "group_id": "g10",
                      "status": "active"
              },
              {
                      "id": "s108",
                      "full_name": "O'ktamov Abduhamid",
                      "group_id": "g12",
                      "status": "active"
              },
              {
                      "id": "s109",
                      "full_name": "Maxkamov Amirjon",
                      "group_id": "g12",
                      "status": "active"
              }
      ],
        attendance: [],
        homework: [],
      }
      localStorage.setItem('support_teacher_mock_db', JSON.stringify(db))
    }

    let list = db[this.table] || []

    for (const filter of this.filters) {
      if (filter.type === 'eq') {
        list = list.filter((item: any) => item[filter.col] === filter.val)
      } else if (filter.type === 'in') {
        list = list.filter((item: any) => filter.val.includes(item[filter.col]))
      }
    }

    if (this.orderCol) {
      list = [...list].sort((a: any, b: any) => {
        const valA = String(a[this.orderCol!] || '')
        const valB = String(b[this.orderCol!] || '')
        return valA.localeCompare(valB)
      })
    }

    if (this.table === 'students' && this.action === 'select') {
      list = list.map((item: any) => {
        const grp = db.groups.find((g: any) => g.id === item.group_id)
        return {
          ...item,
          groups: grp ? { name: grp.name } : null,
        }
      })
    }

    let data: any = list
    let error: any = null

    if (this.action === 'insert') {
      const recordsToInsert = Array.isArray(this.actionData) ? this.actionData : [this.actionData]
      const insertedRecords = recordsToInsert.map((rec: any) => {
        const newRec = {
          id: Math.random().toString(36).substring(2, 11),
          status: 'active',
          ...rec,
          created_at: new Date().toISOString(),
        }
        db[this.table].push(newRec)
        return newRec
      })
      localStorage.setItem('support_teacher_mock_db', JSON.stringify(db))
      data = Array.isArray(this.actionData) ? insertedRecords : insertedRecords[0]
    } else if (this.action === 'update') {
      const targetIds = list.map((item: any) => item.id)
      db[this.table] = db[this.table].map((item: any) => {
        if (targetIds.includes(item.id)) {
          return { ...item, ...this.actionData }
        }
        return item
      })
      localStorage.setItem('support_teacher_mock_db', JSON.stringify(db))
      data = db[this.table].filter((item: any) => targetIds.includes(item.id))
      if (!Array.isArray(this.actionData) && data.length > 0) {
        data = data[0]
      }
    } else if (this.action === 'delete') {
      const targetIds = list.map((item: any) => item.id)
      db[this.table] = db[this.table].filter((item: any) => !targetIds.includes(item.id))
      if (this.table === 'students') {
        db.attendance = db.attendance.filter((item: any) => !targetIds.includes(item.student_id))
        db.homework = db.homework.filter((item: any) => !targetIds.includes(item.student_id))
      }
      localStorage.setItem('support_teacher_mock_db', JSON.stringify(db))
      data = null
    } else if (this.action === 'upsert') {
      const recordsToUpsert = Array.isArray(this.actionData) ? this.actionData : [this.actionData]
      const result: any[] = []
      for (const rec of recordsToUpsert) {
        let existingIdx = -1
        if (this.table === 'attendance') {
          existingIdx = db[this.table].findIndex(
            (item: any) => item.student_id === rec.student_id && item.date === rec.date
          )
        } else if (this.table === 'homework') {
          existingIdx = db[this.table].findIndex(
            (item: any) => item.student_id === rec.student_id && item.date === rec.date
          )
        }

        if (existingIdx >= 0) {
          db[this.table][existingIdx] = {
            ...db[this.table][existingIdx],
            ...rec,
            updated_at: new Date().toISOString(),
          }
          result.push(db[this.table][existingIdx])
        } else {
          const newRec = {
            id: Math.random().toString(36).substring(2, 11),
            ...rec,
            updated_at: new Date().toISOString(),
          }
          db[this.table].push(newRec)
          result.push(newRec)
        }
      }
      localStorage.setItem('support_teacher_mock_db', JSON.stringify(db))
      data = Array.isArray(this.actionData) ? result : result[0]
    }

    if (this.isSingle) {
      data = Array.isArray(data) ? data[0] || null : data
      if (!data) {
        error = { message: 'Row not found' }
      }
    } else if (this.isMaybeSingle) {
      data = Array.isArray(data) ? data[0] || null : data
    }

    return { data, error }
  }

  then(onfulfilled?: (value: { data: any; error: any }) => any) {
    const res = this.execute()
    return Promise.resolve(res).then(onfulfilled)
  }
}

const mockAuth = {
  listeners: [] as Array<(_event: string, session: any) => void>,

  async getSession() {
    const sessionStr = localStorage.getItem('support_teacher_mock_session')
    return {
      data: {
        session: sessionStr ? JSON.parse(sessionStr) : null,
      },
      error: null,
    }
  },

  onAuthStateChange(callback: (_event: string, session: any) => void) {
    this.listeners.push(callback)
    const sessionStr = localStorage.getItem('support_teacher_mock_session')
    callback('SIGNED_IN', sessionStr ? JSON.parse(sessionStr) : null)
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter((l) => l !== callback)
          },
        },
      },
    }
  },

  async signInWithPassword({ email, password }: any) {
    if (password) { /* noop */ }
    const session = {
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-uuid',
        aud: 'authenticated',
        role: 'authenticated',
        email: email || 'teacher@example.com',
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
      },
    }
    localStorage.setItem('support_teacher_mock_session', JSON.stringify(session))
    this.listeners.forEach((l) => l('SIGNED_IN', session))
    return { data: { session }, error: null }
  },

  async signOut() {
    localStorage.removeItem('support_teacher_mock_session')
    this.listeners.forEach((l) => l('SIGNED_OUT', null))
    return { error: null }
  },
}

const mockSupabase = {
  auth: mockAuth,
  from(table: string) {
    return new MockQuery(table)
  },
}

export const supabase = isMock
  ? (mockSupabase as any)
  : createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
